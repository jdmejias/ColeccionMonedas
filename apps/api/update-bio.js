const {PrismaClient} = require('./generated/prisma');
const {PrismaPg} = require('@prisma/adapter-pg');
require('dotenv/config');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => {
    return prisma.userProfile.update({
      where: { userId: 'user-1' },
      data: {
        bio: 'En este espacio podrá conocer el perfil del profesor, incluyendo sus líneas de investigación, proyectos destacados, publicaciones, redes académicas de colaboración, así como sus aportes en docencia, innovación, creación y servicio.'
      }
    });
  })
  .then(r => {
    console.log('✅ Bio actualizada para:', r.name);
    process.exit(0);
  })
  .catch(e => {
    console.error('❌ ERROR:', e.message);
    process.exit(1);
  });
