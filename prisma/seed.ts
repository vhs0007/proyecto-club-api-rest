import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Datos de prueba solo si IS_TESTING=true o isTesting=true (ej. variable en Render).
 * Si no, el script termina sin tocar la base (producción segura).
 *
 * En Render: migraciones + seed en el deploy, con IS_TESTING=true solo en el entorno donde querés datos demo.
 *
 *   npx prisma migrate deploy && npx prisma db seed
 *
 * Referencia rápida para probar APIs (IDs fijos):
 *
 * Club 1 — Club Deportivo Norte
 *   Staff: userId=1 typeId=2 (Ana), asistente userId=2 typeId=2 (Luis)
 *   Socio: userId=3 typeId=1 (María)
 *   Facilities: id 1 (musculación + asistente), id 2 (piscina, sin asistente)
 *   Activities: id 1 (fútbol en facility 1), id 2 (yoga en facility 2)
 *   Tipos membresía facility: id 1 Básica, id 2 Premium
 *
 * Club 2 — Club Sur
 *   Staff: userId=1 typeId=2 (Pedro), asistente userId=2 typeId=2 (Lucía)
 *   Socio: userId=3 typeId=1 (Carlos)
 *   Facility: id 1 (salón multiuso)
 *   Activity: id 1 (spinning)
 *
 * Login prueba (si usás hash): contraseña semilla `demo1234`
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function isSeedTestingEnabled(): boolean {
  return (
    process.env.IS_TESTING === 'true' ||
    process.env.isTesting === 'true'
  );
}

async function clearDevData(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction([
    prisma.datetime_scheduled_activities.deleteMany(),
    prisma.scheduled_activities_assistant_workers.deleteMany(),
    prisma.scheduled_activities_members.deleteMany(),
    prisma.scheduled_activities_membership_types.deleteMany(),
    prisma.scheduled_activities.deleteMany(),
    prisma.working_days.deleteMany(),
    prisma.activity.deleteMany(),
    prisma.facility_workers.deleteMany(),
    prisma.facilities_membership.deleteMany(),
    prisma.facilities.deleteMany(),
    prisma.membership.deleteMany(),
    prisma.membership_type.deleteMany(),
    prisma.time_entries.deleteMany(),
    prisma.numerator.deleteMany(),
    prisma.plugins_clubs.deleteMany(),
    prisma.users.deleteMany(),
    prisma.clubs.deleteMany(),
    prisma.user_type.deleteMany(),
  ]);
}

async function seedTestingData(prisma: PrismaClient): Promise<void> {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  await clearDevData(prisma);

  await prisma.user_type.createMany({
    data: [
      { id: 1, name: 'Socio' },
      { id: 2, name: 'Staff / Entrenador' },
    ],
  });

  await prisma.clubs.createMany({
    data: [
      {
        id: 1,
        name: 'Club Deportivo Norte',
        address: 'Av. Siempre Viva 123',
        phone: '+54 11 1234-5678',
        email: 'contacto@clubnorte.test',
        website: 'https://clubnorte.test',
        isActive: true,
      },
      {
        id: 2,
        name: 'Club Sur',
        address: 'Calle Falsa 456',
        phone: '+54 221 555-0100',
        email: 'info@clubsur.test',
        website: 'https://clubsur.test',
        isActive: true,
      },
    ],
  });

  await prisma.users.createMany({
    data: [
      {
        id: 1,
        clubId: 1,
        typeId: 2,
        name: 'Ana Entrenadora',
        document: 'C1-DNI-ANA',
        email: 'ana.work@c1.test',
        password: passwordHash,
        isActive: true,
      },
      {
        id: 2,
        clubId: 1,
        typeId: 2,
        name: 'Luis Asistente',
        document: 'C1-DNI-LUIS',
        email: 'luis.work@c1.test',
        password: passwordHash,
        isActive: true,
      },
      {
        id: 3,
        clubId: 1,
        typeId: 1,
        name: 'María Socia',
        document: 'C1-DNI-MAR',
        email: 'maria@c1.test',
        password: passwordHash,
        isActive: true,
      },
      {
        id: 1,
        clubId: 2,
        typeId: 2,
        name: 'Pedro Entrenador',
        document: 'C2-DNI-PED',
        email: 'pedro.work@c2.test',
        password: passwordHash,
        isActive: true,
      },
      {
        id: 2,
        clubId: 2,
        typeId: 2,
        name: 'Lucía Asistente',
        document: 'C2-DNI-LUC',
        email: 'lucia.work@c2.test',
        password: passwordHash,
        isActive: true,
      },
      {
        id: 3,
        clubId: 2,
        typeId: 1,
        name: 'Carlos Socio',
        document: 'C2-DNI-CAR',
        email: 'carlos@c2.test',
        password: passwordHash,
        isActive: true,
      },
    ],
  });

  await prisma.membership_type.createMany({
    data: [
      {
        id: 1,
        clubId: 1,
        name: 'Básica mensual',
        price: new Prisma.Decimal(45000),
      },
      {
        id: 2,
        clubId: 1,
        name: 'Premium',
        price: new Prisma.Decimal(78000),
      },
      {
        id: 1,
        clubId: 2,
        name: 'Plan único',
        price: new Prisma.Decimal(52000),
      },
    ],
  });

  await prisma.facilities.createMany({
    data: [
      {
        id: 1,
        clubId: 1,
        type: 'Sala musculación',
        capacity: 40,
        isActive: true,
        ResponsibleWorkerUserId: 1,
        ResponsibleWorkerTypeId: 2,
      },
      {
        id: 2,
        clubId: 1,
        type: 'Piscina climatizada',
        capacity: 24,
        isActive: true,
        ResponsibleWorkerUserId: 1,
        ResponsibleWorkerTypeId: 2,
      },
      {
        id: 1,
        clubId: 2,
        type: 'Salón multiuso',
        capacity: 35,
        isActive: true,
        ResponsibleWorkerUserId: 1,
        ResponsibleWorkerTypeId: 2,
      },
    ],
  });

  await prisma.facility_workers.createMany({
    data: [
      {
        id: 1,
        facilityId: 1,
        clubId: 1,
        userId: 2,
        userTypeId: 2,
      },
      {
        id: 1,
        facilityId: 1,
        clubId: 2,
        userId: 2,
        userTypeId: 2,
      },
    ],
  });

  await prisma.facilities_membership.createMany({
    data: [
      { id: 1, clubId: 1, facilityId: 1, membershipTypeId: 1 },
      { id: 2, clubId: 1, facilityId: 1, membershipTypeId: 2 },
      { id: 3, clubId: 1, facilityId: 2, membershipTypeId: 1 },
      { id: 1, clubId: 2, facilityId: 1, membershipTypeId: 1 },
    ],
  });

  await prisma.numerator.createMany({
    data: [
      { name: 'facilityId', clubId: 1, value: 2 },
      { name: 'activityId', clubId: 1, value: 2 },
      { name: 'facilityId', clubId: 2, value: 1 },
      { name: 'activityId', clubId: 2, value: 1 },
    ],
  });

  await prisma.activity.createMany({
    data: [
      {
        id: 1,
        clubId: 1,
        name: 'Fútbol recreativo',
        type: 'Deporte',
        date: new Date('2026-06-15T12:00:00.000Z'),
        hourStart: '18:00',
        hourEnd: '19:30',
        userId: 3,
        userTypeId: 1,
        cost: new Prisma.Decimal(1500),
        facilityId: 1,
        isActive: true,
      },
      {
        id: 2,
        clubId: 1,
        name: 'Yoga',
        type: 'Bienestar',
        date: new Date('2026-06-16T12:00:00.000Z'),
        hourStart: '09:00',
        hourEnd: '10:00',
        userId: 3,
        userTypeId: 1,
        cost: new Prisma.Decimal(800),
        facilityId: 2,
        isActive: true,
      },
      {
        id: 1,
        clubId: 2,
        name: 'Spinning',
        type: 'Cardio',
        date: new Date('2026-06-17T12:00:00.000Z'),
        hourStart: '07:30',
        hourEnd: '08:15',
        userId: 3,
        userTypeId: 1,
        cost: new Prisma.Decimal(1200),
        facilityId: 1,
        isActive: true,
      },
    ],
  });

  await prisma.membership.createMany({
    data: [
      {
        id: 1,
        clubId: 1,
        membershipTypeId: 1,
        userId: 3,
        userTypeId: 1,
        createdAt: new Date('2026-01-01'),
        expiration: new Date('2027-01-01'),
      },
      {
        id: 1,
        clubId: 2,
        membershipTypeId: 1,
        userId: 3,
        userTypeId: 1,
        createdAt: new Date('2026-02-01'),
        expiration: new Date('2026-12-31'),
      },
    ],
  });

  await prisma.time_entries.createMany({
    data: [
      {
        userId: 1,
        clubId: 1,
        userDocument: 'C1-DNI-ANA',
        clockIn: new Date('2026-06-01T08:00:00.000Z'),
        clockOut: new Date('2026-06-01T16:00:00.000Z'),
      },
    ],
  });

  console.log('Seed OK: 2 clubes, usuarios, facilities, activities, membresías y fichada de ejemplo.');
}

async function main(): Promise<void> {
  if (!isSeedTestingEnabled()) {
    console.log(
      '[seed] Omitido: IS_TESTING / isTesting no es "true". Sin datos de prueba.',
    );
    return;
  }

  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error('Falta DATABASE_URL.');
  }

  const pool = new Pool({ connectionString });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    await seedTestingData(prisma);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
