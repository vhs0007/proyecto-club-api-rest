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
 * user_type: 1 = Trabajador, 2 = Socio, 3 = Atleta
 *
 * Estructura por club (clubes 1 y 2):
 *   - users: 15 (ids 1..5 typeId=1 trabajadores, 6..10 typeId=2 socios, 11..15 typeId=3 atletas)
 *   - membership_type: 5 (ids 1..5)
 *   - facilities: 5 (ids 1..5, responsable trabajador 1..5)
 *   - facility_workers: 5
 *   - facilities_membership: 5
 *   - activity: 5
 *   - membership: 5 (1 por socio)
 *   - time_entries: 5 (1 por trabajador)
 *   - working_days: 5 (Lunes..Viernes)
 *   - scheduled_activities: 5
 *   - scheduled_activities_assistant_workers: 5
 *   - scheduled_activities_membership_types: 5
 *   - scheduled_activities_members: 5
 *   - datetime_scheduled_activities: 5
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

const CLUB_IDS = [1, 2] as const;
const PER_TYPE = 5;
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

function userDocument(clubId: number, typeId: number, n: number): string {
  return `C${clubId}-T${typeId}-U${n}`;
}

function userEmail(clubId: number, typeId: number, n: number): string {
  return `u${typeId}-${n}@c${clubId}.test`;
}

async function seedTestingData(prisma: PrismaClient): Promise<void> {
  const passwordHash = await bcrypt.hash('demo1234', 10);

  await clearDevData(prisma);

  await prisma.user_type.createMany({
    data: [
      { id: 1, name: 'Trabajador' },
      { id: 2, name: 'Socio' },
      { id: 3, name: 'Atleta' },
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

  const usersData: Prisma.usersCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (const typeId of [1, 2, 3] as const) {
      for (let n = 1; n <= PER_TYPE; n++) {
        // typeId=1 -> ids 1..5, typeId=2 -> ids 6..10, typeId=3 -> ids 11..15
        const id = (typeId - 1) * PER_TYPE + n;
        usersData.push({
          id,
          clubId,
          typeId,
          name: `Club${clubId} Tipo${typeId} Usuario${n}`,
          document: userDocument(clubId, typeId, n),
          email: userEmail(clubId, typeId, n),
          password: passwordHash,
          isActive: true,
        });
      }
    }
  }
  await prisma.users.createMany({ data: usersData });

  const membershipTypesData: Prisma.membership_typeCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      membershipTypesData.push({
        id: n,
        clubId,
        name: `Plan ${n} (club ${clubId})`,
        price: new Prisma.Decimal(40000 + n * 5000),
      });
    }
  }
  await prisma.membership_type.createMany({ data: membershipTypesData });

  const facilitiesData: Prisma.facilitiesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      facilitiesData.push({
        id: n,
        clubId,
        type: `Instalación ${n} (club ${clubId})`,
        capacity: 20 + n * 5,
        isActive: true,
        ResponsibleWorkerUserId: n,
        ResponsibleWorkerTypeId: 1,
      });
    }
  }
  await prisma.facilities.createMany({ data: facilitiesData });

  const facilityWorkersData: Prisma.facility_workersCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      facilityWorkersData.push({
        id: n,
        clubId,
        facilityId: n,
        userId: n,
        userTypeId: 1,
      });
    }
  }
  await prisma.facility_workers.createMany({ data: facilityWorkersData });

  const facilitiesMembershipData: Prisma.facilities_membershipCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      facilitiesMembershipData.push({
        id: n,
        clubId,
        facilityId: n,
        membershipTypeId: n,
      });
    }
  }
  await prisma.facilities_membership.createMany({ data: facilitiesMembershipData });

  const activityData: Prisma.activityCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      activityData.push({
        id: n,
        clubId,
        name: `Actividad ${n} (club ${clubId})`,
        type: 'Deporte',
        date: new Date(`2026-06-${10 + n}T12:00:00.000Z`),
        hourStart: `${String(8 + n).padStart(2, '0')}:00`,
        hourEnd: `${String(9 + n).padStart(2, '0')}:00`,
        userId: 5 + n,
        userTypeId: 2,
        cost: new Prisma.Decimal(800 + n * 100),
        facilityId: n,
        isActive: true,
      });
    }
  }
  await prisma.activity.createMany({ data: activityData });

  const membershipData: Prisma.membershipCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      membershipData.push({
        id: n,
        clubId,
        membershipTypeId: n,
        userId: 5 + n,
        userTypeId: 2,
        createdAt: new Date(`2026-01-${String(n).padStart(2, '0')}`),
        expiration: new Date(`2027-01-${String(n).padStart(2, '0')}`),
      });
    }
  }
  await prisma.membership.createMany({ data: membershipData });

  const timeEntriesData: Prisma.time_entriesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      timeEntriesData.push({
        userId: n,
        clubId,
        userDocument: userDocument(clubId, 1, n),
        clockIn: new Date(`2026-06-0${n}T08:00:00.000Z`),
        clockOut: new Date(`2026-06-0${n}T16:00:00.000Z`),
      });
    }
  }
  await prisma.time_entries.createMany({ data: timeEntriesData });

  const workingDaysData: Prisma.working_daysCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      workingDaysData.push({
        id: n,
        clubId,
        dayOfWeek: DAYS[n - 1],
      });
    }
  }
  await prisma.working_days.createMany({ data: workingDaysData });

  const scheduledData: Prisma.scheduled_activitiesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      scheduledData.push({
        id: n,
        clubId,
        facilityId: n,
        userId: n,
        userTypeId: 1,
        name: `Actividad ${n} (club ${clubId})`,
      });
    }
  }
  await prisma.scheduled_activities.createMany({ data: scheduledData });

  const scheduledAssistantsData: Prisma.scheduled_activities_assistant_workersCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      const assistantUserId = (n % 5) + 1;
      scheduledAssistantsData.push({
        id: n,
        clubId,
        scheduledActivityId: n,
        userId: assistantUserId,
        userTypeId: 1,
      });
    }
  }
  await prisma.scheduled_activities_assistant_workers.createMany({ data: scheduledAssistantsData });

  const scheduledMembershipTypesData: Prisma.scheduled_activities_membership_typesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      scheduledMembershipTypesData.push({
        id: n,
        clubId,
        scheduledActivityId: n,
        membershipTypeId: n,
      });
    }
  }
  await prisma.scheduled_activities_membership_types.createMany({ data: scheduledMembershipTypesData });

  const scheduledMembersData: Prisma.scheduled_activities_membersCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      scheduledMembersData.push({
        id: n,
        clubId,
        scheduledActivityId: n,
        userId: 5 + n,
        userTypeId: 2,
      });
    }
  }
  await prisma.scheduled_activities_members.createMany({ data: scheduledMembersData });

  const datetimeScheduledData: Prisma.datetime_scheduled_activitiesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    for (let n = 1; n <= 5; n++) {
      datetimeScheduledData.push({
        id: n,
        clubId,
        scheduledActivityId: n,
        workingDayId: n,
        hourStart: `${String(8 + n).padStart(2, '0')}:00`,
        hourEnd: `${String(9 + n).padStart(2, '0')}:00`,
      });
    }
  }
  await prisma.datetime_scheduled_activities.createMany({ data: datetimeScheduledData });

  const numeratorData: Prisma.numeratorCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    numeratorData.push(
      { name: 'facilityId', clubId, value: 5 },
      { name: 'activityId', clubId, value: 5 },
      { name: 'membershipId', clubId, value: 5 },
      { name: 'memberId', clubId, value: 10 },
      { name: 'athleteId', clubId, value: 15 },
      { name: 'adminId', clubId, value: 5 },
      { name: 'scheduledActivityId', clubId, value: 5 },
      { name: 'workingDayId', clubId, value: 5 },
    );
  }
  await prisma.numerator.createMany({ data: numeratorData });

  console.log(
    'Seed OK: 2 clubes con 15 users + 5 registros por club en facilities, activities, memberships, scheduled_activities y tablas intermedias.',
  );
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
