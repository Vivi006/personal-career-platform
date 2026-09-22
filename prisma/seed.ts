import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@portfolio.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminPassword123!', 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: 'Administrateur',
        role: 'ADMIN',
      },
    });
    console.log('✅ Compte Administrateur créé avec succès !');
  } else {
    console.log('ℹ️ Le compte Administrateur existe déjà.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });