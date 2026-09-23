import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';

export async function GET() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token || !(await verifyJWT(token))) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
  return NextResponse.json(await prisma.lead.findMany({ include: { notes: { orderBy: { createdAt: 'desc' } } }, orderBy: { updatedAt: 'desc' } }));
}
