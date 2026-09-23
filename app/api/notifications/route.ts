import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';

async function adminId() {
  const token = (await cookies()).get('admin_token')?.value;
  const payload = token ? await verifyJWT(token) : null;
  return payload?.id as string | undefined;
}

export async function GET() {
  const userId = await adminId();
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  return NextResponse.json(await prisma.notification.findMany({ where: { OR: [{ userId }, { userId: null }] }, orderBy: { createdAt: 'desc' }, take: 20 }));
}

export async function PATCH() {
  const userId = await adminId();
  if (!userId) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  await prisma.notification.updateMany({ where: { OR: [{ userId }, { userId: null }], read: false }, data: { read: true } });
  return NextResponse.json({ success: true });
}
