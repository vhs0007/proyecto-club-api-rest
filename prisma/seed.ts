import path from 'path';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

/**
 * Datos de prueba solo si IS_TESTING=true o isTesting=true (ej. variable en Render).
 * Si no, el script termina sin tocar la base (producción segura).
 *
 *   npx prisma migrate deploy && npx prisma db seed
 *
 * user_type: 1 = Trabajador, 2 = Socio, 3 = Atleta
 * Por club: 5 trabajadores (ids 1-5), 5 socios (6-10), 5 atletas (11-15)
 *
 * Login prueba: contraseña `demo1234`
 */

import { PrismaClient, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

function isSeedTestingEnabled(): boolean {
  return (
    process.env.IS_TESTING === 'true' ||
    process.env.isTesting === 'true'
  );
}

const CLUB_IDS = [1, 2] as const;
type ClubId = (typeof CLUB_IDS)[number];
const PER_TYPE = 5;
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

type ClubSeedProfile = {
  workers: string[];
  members: string[];
  athletes: string[];
  facilities: string[];
  membershipPlans: string[];
  scheduledActivities: string[];
  /** Por actividad (índice 0..4): ids de trabajadores asistentes (typeId=1) */
  scheduleAssistants: number[][];
  /** Por actividad: bloques horarios */
  scheduleSlots: { workingDayId: number; hourStart: string; hourEnd: string }[][];
  /** Por actividad: ids de tipos de membresía asociados */
  scheduleMembershipTypes: number[][];
};

const CLUB_PROFILES: Record<(typeof CLUB_IDS)[number], ClubSeedProfile> = {
  1: {
    workers: [
      'Ana García',
      'Luis Martínez',
      'Carla Rodríguez',
      'Diego Fernández',
      'Sofía López',
    ],
    members: [
      'María Pérez',
      'Carlos Gómez',
      'Lucía Herrera',
      'Jorge Ruiz',
      'Elena Vargas',
    ],
    athletes: [
      'Tomás Acosta',
      'Valentina Morales',
      'Facundo Ríos',
      'Camila Torres',
      'Benjamín Silva',
    ],
    facilities: [
      'Sala de musculación',
      'Piscina climatizada',
      'Cancha de fútbol 7',
      'Sala de spinning',
      'Estudio de yoga',
    ],
    membershipPlans: [
      'Membresía Básica',
      'Membresía Premium',
      'Membresía Familiar',
      'Pase diario',
      'Corporate Wellness',
    ],
    scheduledActivities: [
      'Musculación guiada mañana',
      'Natación nivel inicial',
      'Fútbol formativo',
      'Spinning intenso',
      'Yoga y estiramiento',
    ],
    scheduleAssistants: [
      [2, 3],
      [3, 4, 5],
      [1, 4],
      [2, 5],
      [1, 3, 4],
    ],
    scheduleSlots: [
      [
        { workingDayId: 1, hourStart: '07:00', hourEnd: '09:00' },
        { workingDayId: 3, hourStart: '07:00', hourEnd: '09:00' },
        { workingDayId: 5, hourStart: '08:00', hourEnd: '10:00' },
      ],
      [
        { workingDayId: 2, hourStart: '10:00', hourEnd: '11:30' },
        { workingDayId: 4, hourStart: '10:00', hourEnd: '11:30' },
      ],
      [
        { workingDayId: 1, hourStart: '16:00', hourEnd: '18:00' },
        { workingDayId: 3, hourStart: '16:00', hourEnd: '18:00' },
        { workingDayId: 5, hourStart: '17:00', hourEnd: '19:00' },
      ],
      [
        { workingDayId: 2, hourStart: '18:00', hourEnd: '19:00' },
        { workingDayId: 4, hourStart: '18:00', hourEnd: '19:00' },
        { workingDayId: 5, hourStart: '19:00', hourEnd: '20:00' },
      ],
      [
        { workingDayId: 1, hourStart: '09:00', hourEnd: '10:00' },
        { workingDayId: 2, hourStart: '09:00', hourEnd: '10:00' },
        { workingDayId: 4, hourStart: '09:00', hourEnd: '10:00' },
      ],
    ],
    scheduleMembershipTypes: [
      [1, 2],
      [1, 3],
      [2, 4],
      [2, 5],
      [1, 2, 3],
    ],
  },
  2: {
    workers: [
      'Pedro Sánchez',
      'Lucía Fernández',
      'Miguel Torres',
      'Andrea Romero',
      'Javier Navarro',
    ],
    members: [
      'Carmen Díaz',
      'Roberto Castro',
      'Isabel Molina',
      'Fernando Ortega',
      'Patricia Jiménez',
    ],
    athletes: [
      'Juana Méndez',
      'Martín Suárez',
      'Sofía Delgado',
      'Nicolás Ramos',
      'Paula Iglesias',
    ],
    facilities: [
      'Gimnasio principal',
      'Sala multiuso',
      'Cancha de básquet',
      'Box de cross training',
      'Pista de atletismo',
    ],
    membershipPlans: [
      'Plan Mensual',
      'Plan Trimestral',
      'Plan Anual',
      'Socio invitado',
      'Plan estudiante',
    ],
    scheduledActivities: [
      'Cross training funcional',
      'Básquet recreativo',
      'Running en pista',
      'HIIT multiuso',
      'Preparación física atletas',
    ],
    scheduleAssistants: [
      [2, 4],
      [1, 3, 5],
      [2, 3],
      [3, 4, 5],
      [1, 2],
    ],
    scheduleSlots: [
      [
        { workingDayId: 1, hourStart: '06:30', hourEnd: '08:00' },
        { workingDayId: 3, hourStart: '06:30', hourEnd: '08:00' },
        { workingDayId: 5, hourStart: '07:00', hourEnd: '08:30' },
      ],
      [
        { workingDayId: 2, hourStart: '19:00', hourEnd: '21:00' },
        { workingDayId: 4, hourStart: '19:00', hourEnd: '21:00' },
      ],
      [
        { workingDayId: 1, hourStart: '07:00', hourEnd: '08:30' },
        { workingDayId: 4, hourStart: '07:00', hourEnd: '08:30' },
        { workingDayId: 5, hourStart: '08:00', hourEnd: '09:30' },
      ],
      [
        { workingDayId: 2, hourStart: '12:00', hourEnd: '13:00' },
        { workingDayId: 3, hourStart: '12:00', hourEnd: '13:00' },
        { workingDayId: 5, hourStart: '12:30', hourEnd: '13:30' },
      ],
      [
        { workingDayId: 1, hourStart: '17:00', hourEnd: '19:00' },
        { workingDayId: 3, hourStart: '17:00', hourEnd: '19:00' },
        { workingDayId: 4, hourStart: '18:00', hourEnd: '20:00' },
      ],
    ],
    scheduleMembershipTypes: [
      [1, 5],
      [2, 3],
      [1, 2, 4],
      [3, 4],
      [2, 5],
    ],
  },
};

function getClubProfile(clubId: ClubId): ClubSeedProfile {
  return CLUB_PROFILES[clubId];
}

function userDocument(clubId: ClubId, typeId: number, n: number): string {
  return `DNI-${clubId}${typeId}${String(n).padStart(2, '0')}`;
}

function userEmail(clubId: ClubId, typeId: number, n: number): string {
  const slug = getClubProfile(clubId).workers[0].split(' ')[1]?.toLowerCase() ?? 'club';
  return `${typeId === 1 ? 'staff' : typeId === 2 ? 'socio' : 'atleta'}.${n}@${slug}c${clubId}.test`;
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
        address: 'Av. del Libertador 2450, Vicente López',
        phone: '+54 11 4789-3200',
        email: 'contacto@clubnorte.test',
        website: 'https://clubnorte.test',
        isActive: true,
      },
      {
        id: 2,
        name: 'Club Sur',
        address: 'Bv. Pellegrini 1280, Rosario',
        phone: '+54 341 555-0100',
        email: 'info@clubsur.test',
        website: 'https://clubsur.test',
        isActive: true,
      },
    ],
  });

  const usersData: Prisma.usersCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    for (const typeId of [1, 2, 3] as const) {
      const names =
        typeId === 1
          ? profile.workers
          : typeId === 2
            ? profile.members
            : profile.athletes;
      for (let n = 1; n <= PER_TYPE; n++) {
        const id = (typeId - 1) * PER_TYPE + n;
        usersData.push({
          id,
          clubId,
          typeId,
          name: names[n - 1],
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
    const profile = getClubProfile(clubId);
    for (let n = 1; n <= 5; n++) {
      membershipTypesData.push({
        id: n,
        clubId,
        name: profile.membershipPlans[n - 1],
        price: new Prisma.Decimal(35000 + n * 7500),
      });
    }
  }
  await prisma.membership_type.createMany({ data: membershipTypesData });

  const facilitiesData: Prisma.facilitiesCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    for (let n = 1; n <= 5; n++) {
      facilitiesData.push({
        id: n,
        clubId,
        type: profile.facilities[n - 1],
        capacity: 15 + n * 8,
        isActive: true,
        ResponsibleWorkerUserId: n,
        ResponsibleWorkerTypeId: 1,
      });
    }
  }
  await prisma.facilities.createMany({ data: facilitiesData });

  const facilityWorkersData: Prisma.facility_workersCreateManyInput[] = [];
  let maxFacilityWorkersPerClub = 0;
  for (const clubId of CLUB_IDS) {
    let facilityWorkerRowId = 0;
    for (let facilityId = 1; facilityId <= 5; facilityId++) {
      const responsibleId = facilityId;
      const assistantIds = [1, 2, 3, 4, 5].filter((id) => id !== responsibleId).slice(0, 2);
      for (const userId of [responsibleId, ...assistantIds]) {
        facilityWorkerRowId += 1;
        facilityWorkersData.push({
          id: facilityWorkerRowId,
          clubId,
          facilityId,
          userId,
          userTypeId: 1,
        });
      }
    }
    maxFacilityWorkersPerClub = facilityWorkerRowId;
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

  const activityNames = [
    'Reserva cancha',
    'Clase de prueba',
    'Torneo interno',
    'Evaluación física',
    'Sesión personalizada',
  ];
  const activityData: Prisma.activityCreateManyInput[] = [];
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    for (let n = 1; n <= 5; n++) {
      activityData.push({
        id: n,
        clubId,
        name: `${activityNames[n - 1]} — ${profile.members[n - 1].split(' ')[0]}`,
        type: 'Reserva',
        date: new Date(`2026-06-${10 + n}T12:00:00.000Z`),
        hourStart: `${String(8 + n).padStart(2, '0')}:00`,
        hourEnd: `${String(9 + n).padStart(2, '0')}:00`,
        userId: 5 + n,
        userTypeId: 2,
        cost: new Prisma.Decimal(1200 + n * 250),
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
    const profile = getClubProfile(clubId);
    for (let n = 1; n <= 5; n++) {
      scheduledData.push({
        id: n,
        clubId,
        facilityId: n,
        userId: n,
        userTypeId: 1,
        name: profile.scheduledActivities[n - 1],
      });
    }
  }
  await prisma.scheduled_activities.createMany({ data: scheduledData });

  const scheduledAssistantsData: Prisma.scheduled_activities_assistant_workersCreateManyInput[] =
    [];
  let maxAssistantsPerClub = 0;
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    let assistantRowId = 0;
    for (let activityId = 1; activityId <= 5; activityId++) {
      const responsibleId = activityId;
      for (const userId of profile.scheduleAssistants[activityId - 1]) {
        if (userId === responsibleId) continue;
        assistantRowId += 1;
        scheduledAssistantsData.push({
          id: assistantRowId,
          clubId,
          scheduledActivityId: activityId,
          userId,
          userTypeId: 1,
        });
      }
    }
    maxAssistantsPerClub = assistantRowId;
  }
  await prisma.scheduled_activities_assistant_workers.createMany({
    data: scheduledAssistantsData,
  });

  const scheduledMembershipTypesData: Prisma.scheduled_activities_membership_typesCreateManyInput[] =
    [];
  let maxMembershipLinksPerClub = 0;
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    let membershipLinkRowId = 0;
    for (let activityId = 1; activityId <= 5; activityId++) {
      for (const membershipTypeId of profile.scheduleMembershipTypes[activityId - 1]) {
        membershipLinkRowId += 1;
        scheduledMembershipTypesData.push({
          id: membershipLinkRowId,
          clubId,
          scheduledActivityId: activityId,
          membershipTypeId,
        });
      }
    }
    maxMembershipLinksPerClub = membershipLinkRowId;
  }
  await prisma.scheduled_activities_membership_types.createMany({
    data: scheduledMembershipTypesData,
  });

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
  let maxDatetimesPerClub = 0;
  for (const clubId of CLUB_IDS) {
    const profile = getClubProfile(clubId);
    let datetimeRowId = 0;
    for (let activityId = 1; activityId <= 5; activityId++) {
      for (const slot of profile.scheduleSlots[activityId - 1]) {
        datetimeRowId += 1;
        datetimeScheduledData.push({
          id: datetimeRowId,
          clubId,
          scheduledActivityId: activityId,
          workingDayId: slot.workingDayId,
          hourStart: slot.hourStart,
          hourEnd: slot.hourEnd,
        });
      }
    }
    maxDatetimesPerClub = datetimeRowId;
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
      { name: 'facilityWorkerId', clubId, value: maxFacilityWorkersPerClub },
      {
        name: 'scheduledActivityAssistantId',
        clubId,
        value: maxAssistantsPerClub,
      },
      {
        name: 'scheduledActivityMembershipTypeId',
        clubId,
        value: maxMembershipLinksPerClub,
      },
      {
        name: 'datetimeScheduledActivityId',
        clubId,
        value: maxDatetimesPerClub,
      },
    );
  }
  await prisma.numerator.createMany({ data: numeratorData });

  console.log(
    `Seed OK: 2 clubes, nombres reales, hasta ${maxAssistantsPerClub} asistentes y ${maxDatetimesPerClub} horarios por club en actividades rutinarias.`,
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
