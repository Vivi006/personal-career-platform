import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      select: { id: true, name: true, duration: true, price: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(services, {
      headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Erreur GET Services:', error);
    return NextResponse.json({ error: 'Impossible de récupérer les prestations.' }, { status: 500 });
  }
}
