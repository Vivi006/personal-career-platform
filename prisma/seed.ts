import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: 'Administrateur',
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: 'Administrateur',
      role: 'ADMIN',
    },
  });

  const services = [
    { id: 'service-consultation-strategique', name: 'Consultation stratégique', duration: 30 },
    { id: 'service-portfolio', name: 'Création ou refonte de portfolio', duration: 60 },
    { id: 'service-site-conversion', name: 'Site vitrine & conversion', duration: 60 },
    { id: 'service-automatisation-crm', name: 'Automatisation CRM & IA', duration: 45 },
  ];
  const admin = await prisma.user.findUniqueOrThrow({
    where: { email: adminEmail },
    select: { id: true },
  });

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: { name: service.name, duration: service.duration, userId: admin.id },
      create: { ...service, userId: admin.id },
    });
  }

  console.log(`✅ Compte administrateur prêt : ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });