import * as dotenv from 'dotenv';
import * as path from 'node:path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
    await prisma.userProfile.upsert({
        where: { userId: 'user-1' },
        create: {
            userId: 'user-1',
            name: 'Juan Carlos Martínez Arias',
            photoUrl: 'https://www.javerianacali.edu.co/sites/default/files/2024-01/Juan-Carlos-Martinez-Arias-Javeriana-Cali_3.jpg',
            bio: 'Ingeniería y Ciencias · Pontificia Universidad Javeriana Cali · Coleccionista numismático. juancmartinez@javerianacali.edu.co',
        },
        update: {},
    });
    console.log('Perfil insertado.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
