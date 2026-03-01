import { PrismaClient } from '../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

const pieces = [
  {
    name: '1 Abbasi - Abbas I Safavi',
    type: 'Moneda',
    country: 'Irán',
    year: 1588,
    conservationState: 'Bueno',
    imageUrl: 'https://en.numista.com/catalogue/photos/iran/1021-180.jpg',
    description: 'Plata, 7,65 g, 22,5 mm. Abbas I (1588-1629). Valor: 4 Shahi. Ref: Album Islamic# 2634.4, KM# 114',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '1 Ducat - Francis Joseph Maximillian',
    type: 'Moneda',
    country: 'Bohemia',
    year: 1794,
    conservationState: 'Muy Bueno',
    imageUrl: 'https://en.numista.com/catalogue/photos/lobkowicz_counts/696535926935a4.93482598-180.jpg',
    description: 'Oro 986, 3,5 g, 20,6 mm. Condado de Lobkowitz, Reino de Bohemia. Ref: KM# 12, Don# 3562',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '100 Dollars - State of Nebraska',
    type: 'Billete',
    country: 'Estados Unidos',
    year: 2022,
    conservationState: 'Excelente',
    imageUrl: 'https://en.numista.com/catalogue/photos/etats-unis/68b6f41a4eb4f2.20543512-180.jpg',
    description: 'Billete de fantasía. Papel, 179,50 × 76,20 mm.',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '50 Roubles',
    type: 'Moneda',
    country: 'Rusia',
    year: 2008,
    conservationState: 'Excelente',
    imageUrl: 'https://en.numista.com/catalogue/photos/russie/661d95d833b9e1.82165014-180.jpg',
    description: 'Oro 999, 7,89 g, 22,60 mm, grosor 1,30 mm. Moneda no circulante. Ref: Y# 1141, CBR# 5216-0067',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '25 Céntimos - Torvizcón',
    type: 'Billete',
    country: 'España',
    year: 1936,
    conservationState: 'Regular',
    imageUrl: 'https://en.numista.com/catalogue/photos/torvizcon_notgeld/6584741678b0f4.67740389-180.jpg',
    description: 'Billete de emergencia. Papel, 99 × 55 mm. Municipio de Torvizcón, Segunda República (1936-1939).',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: 'Medal - Baudoin I and Fabiola',
    type: 'Moneda',
    country: 'Bélgica',
    year: 1992,
    conservationState: 'Excelente',
    imageUrl: 'https://en.numista.com/catalogue/photos/belgique/60620bbaf12e29.27490209-180.jpg',
    description: 'Medalla conmemorativa. Plata 950, 6,45 g, 21 mm.',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '10 Céntimos - San Miguel de Salinas',
    type: 'Billete',
    country: 'España',
    year: 1937,
    conservationState: 'Regular',
    imageUrl: 'https://en.numista.com/catalogue/photos/san_miguel_de_salinas_municipality_notgeld/64ea3f732dc3a4.53962074-180.jpg',
    description: 'Billete de emergencia. Papel, 93 × 62 mm. Municipio San Miguel de Salinas. Ref: Gari Mon# 1308-D',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: 'Nummus - Constantius Gallus',
    type: 'Moneda',
    country: 'Imperio Romano',
    year: 351,
    conservationState: 'Pobre',
    imageUrl: 'https://en.numista.com/catalogue/photos/rome/65e8d46b626fb2.31295800-180.jpg',
    description: 'Bronce, 5,14 g, 19,89 mm. Nummus/Follis. Imperio Romano (351-355). Ref: RIC VIII# 117',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '10 Roubles',
    type: 'Moneda',
    country: 'Rusia',
    year: 2020,
    conservationState: 'Excelente',
    imageUrl: 'https://en.numista.com/catalogue/photos/russie/651a9d595c2d15.03741319-180.jpg',
    description: 'Bimetálica (acero chapado en níquel y latón), 7,9 g, 27 mm. Moneda conmemorativa circulante. Ref: CBR# 5714-0070',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: '1 Peso',
    type: 'Moneda',
    country: 'Chile',
    year: 1932,
    conservationState: 'Bueno',
    imageUrl: 'https://en.numista.com/catalogue/photos/chili/1234-180.jpg',
    description: 'Vellón (plata 400), 6 g, 26 mm, grosor 1,5 mm. República de Chile. Ref: KM# 174',
    availableForExchange: false,
    userId: 'user-1',
  },
  {
    name: 'Görlitz Shekel',
    type: 'Moneda',
    country: 'Israel',
    year: 1990,
    conservationState: 'Muy Bueno',
    imageUrl: 'https://en.numista.com/catalogue/photos/israel/6062c62d9e0178.35673332-180.jpg',
    description: 'Ficha/token. Latón de níquel, 12,21 g, 34,31 mm, grosor 2,35 mm. Año estimado.',
    availableForExchange: false,
    userId: 'user-1',
  },
];

async function main() {
  console.log('Iniciando seed...');
  let inserted = 0;
  for (const piece of pieces) {
    await prisma.piece.create({ data: piece });
    inserted++;
    console.log(`  ✓ ${piece.name}`);
  }
  console.log(`\nSeed completado: ${inserted} piezas insertadas.`);
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
