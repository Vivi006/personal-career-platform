import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';
import { leadStatusSchema } from '../../../../lib/validations';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const result = leadStatusSchema.safeParse((await request.json()).status);
  if (!result.success) return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  const { id } = await params;
  return NextResponse.json(await prisma.lead.update({ where: { id }, data: { status: result.data } }));
}
