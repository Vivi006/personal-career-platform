import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const status = body.status;
  if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide.' }, { status: 400 });
  }
  const appointment = await prisma.appointment.update({ where: { id }, data: { status } });
  return NextResponse.json(appointment);
}
