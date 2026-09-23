import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';
import { enforceRateLimit } from '../../../lib/rate-limit';
import { messageSchema } from '../../../lib/validations';

export async function GET() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  return NextResponse.json(await prisma.conversation.findMany({
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { updatedAt: 'desc' },
  }));
}

export async function POST(request: Request) {
  const rateLimitResponse = await enforceRateLimit(request, 'publicForm');
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const result = messageSchema.safeParse(await request.json());
    if (!result.success) return NextResponse.json({ error: 'Message invalide.', details: result.error.flatten() }, { status: 400 });
    const { guestName, guestEmail, content } = result.data;
    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } });
    const conversation = await prisma.$transaction(async (tx) => {
      let current = await tx.conversation.findFirst({ where: { guestEmail }, orderBy: { updatedAt: 'desc' } });
      if (!current) current = await tx.conversation.create({ data: { guestName, guestEmail } });
      await tx.message.create({ data: { conversationId: current.id, content } });
      const lead = await tx.lead.findFirst({ where: { email: guestEmail }, orderBy: { updatedAt: 'desc' } });
      if (!lead) await tx.lead.create({ data: { name: guestName, email: guestEmail } });
      await tx.notification.create({ data: { title: 'Nouveau message', message: `${guestName} vous a écrit.`, type: 'MESSAGE', userId: admin?.id } });
      return tx.conversation.findUnique({ where: { id: current.id }, include: { messages: true } });
    });
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Erreur POST Message:', error);
    return NextResponse.json({ error: 'Impossible d’envoyer le message.' }, { status: 500 });
  }
}
