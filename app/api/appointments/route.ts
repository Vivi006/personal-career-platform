import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { prisma } from '../../../lib/prisma';
import { verifyJWT } from '../../../lib/auth';
import { enforceRateLimit } from '../../../lib/rate-limit';
import { appointmentSchema } from '../../../lib/validations';

export async function GET(request: Request) {
  try {
    const token = (await cookies()).get('admin_token')?.value;
    if (!token || !(await verifyJWT(token))) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const appointments = await prisma.appointment.findMany({
      include: { service: { select: { name: true, duration: true } } },
      orderBy: { date: 'asc' },
    });
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Erreur GET Appointments:', error);
    return NextResponse.json({ error: 'Impossible de récupérer les rendez-vous.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const rateLimitResponse = await enforceRateLimit(request, 'publicForm');
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const result = appointmentSchema.safeParse(await request.json());
    if (!result.success) {
      return NextResponse.json({ error: 'Données de rendez-vous invalides.', details: result.error.flatten() }, { status: 400 });
    }

    const { guestName, guestEmail, date, serviceId } = result.data;
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return NextResponse.json({ error: 'Service introuvable.' }, { status: 404 });

    const existing = await prisma.appointment.findFirst({
      where: { serviceId, date, status: { not: 'CANCELLED' } },
    });
    if (existing) return NextResponse.json({ error: 'Ce créneau est déjà réservé.' }, { status: 409 });

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } });
    const appointment = await prisma.$transaction(async (tx) => {
      const created = await tx.appointment.create({
        data: { guestName, guestEmail, date, serviceId },
        include: { service: { select: { name: true } } },
      });
      const lead = await tx.lead.findFirst({ where: { email: guestEmail }, orderBy: { updatedAt: 'desc' } });
      if (lead) {
        await tx.lead.update({ where: { id: lead.id }, data: { name: guestName, status: 'NOUVEAU' } });
      } else {
        await tx.lead.create({ data: { name: guestName, email: guestEmail } });
      }
      await tx.notification.create({
        data: {
          title: 'Nouveau rendez-vous',
          message: `${guestName} a demandé un rendez-vous pour ${created.service.name}.`,
          type: 'APPOINTMENT',
          userId: admin?.id,
        },
      });
      return created;
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error('Erreur POST Appointment:', error);
    return NextResponse.json({ error: 'Impossible de créer le rendez-vous.' }, { status: 500 });
  }
}
