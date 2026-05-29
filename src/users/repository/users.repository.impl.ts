import { Injectable } from '@nestjs/common';
import { numerator, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  DatetimeScheduledActivityNavigation,
  IUsersRepository,
  MembershipTypeNavigation,
  ScheduledActivityNavigation,
  UserNavigation,
  WorkingDayNavigation,
} from './users.repository';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UserTypeResponseDto } from '../../user_type/dto/response/user-type-response.dto';
import { membershipNavigation } from './users.repository';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
import { QueryUserRequestDto } from '../dto/request/query-user.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';
import type { FacilityNavigation } from 'src/facilities/repository/facilities.repository';

interface UserRow {
  id: number;
  name: string;
  typeId: number;
  type?: UserTypeResponseDto;
  email: string | null;
  password: string | null;
  membership?: membershipNavigation;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  salary?: { toNumber(): number } | null;
  hoursToWorkPerDay: number | null;
  employmentStartDate: Date | null;
  startWorkAt: string | null;
  endWorkAt: string | null;
  weight?: { toNumber(): number } | null;
  height?: { toNumber(): number } | null;
  gender: string | null;
  birthDate: Date | null;
  diet: string | null;
  trainingPlan: string | null;
  medicalHistory: string | null;
  allergies: string | null;
  medications: string | null;
  medicalConditions: string | null;
  document: string;
}

type MembershipWithTypeRow = {
  id: number;
  userId: number;
  expiration: Date;
  createdAt: Date;
  membershipTypeId: number;
  type: {
    id: number;
    name: string;
    price: Prisma.Decimal;
  } | null;
};

type MembershipTypeFromPrisma = {
  id: number;
  name: string;
  price: Prisma.Decimal;
};

interface WorkingDayRow {
  id: number;
  dayOfWeek: string;
}

interface DatetimeScheduledActivityRow {
  hourStart: string;
  hourEnd: string;
  working_day: WorkingDayRow;
}

interface ScheduledActivityMembershipLinkRow {
  membership_type: MembershipTypeFromPrisma;
}

interface UserTypeRow {
  id: number;
  name: string;
}

interface UserWithTypeRow {
  id: number;
  name: string;
  email: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  type: UserTypeRow;
}

interface ScheduledActivityAssistantLinkRow {
  user: UserWithTypeRow;
}

interface ScheduledActivityQueryRow {
  id: number;
  clubId: number;
  facilityId: number;
  userId: number;
  userTypeId: number;
  scheduled_activities_assistant_workers: ScheduledActivityAssistantLinkRow[];
  scheduled_activities_membership_types: ScheduledActivityMembershipLinkRow[];
  datetime_scheduled_activities: DatetimeScheduledActivityRow[];
}

function mapMembership(row: MembershipWithTypeRow): membershipNavigation {
  const membershipType = new MembershipTypeResponseDto();
  membershipType.id = row.type?.id ?? row.membershipTypeId;
  membershipType.name = row.type?.name ?? '';
  membershipType.price = row.type?.price?.toNumber() ?? 0;

  return {
    id: row.id,
    expiration: row.expiration,
    createdAt: row.createdAt,
    membershipType,
  };
}

function getLastMembership(
  memberships: MembershipWithTypeRow[],
): membershipNavigation | undefined {
  if (memberships.length === 0) return undefined;

  const latest = memberships.reduce((current, item) =>
    item.createdAt > current.createdAt ? item : current,
  );

  return mapMembership(latest);
}

function mapRow(row: UserRow): UserResponseDto {
  const type = row.type ? new UserTypeResponseDto() : undefined;
  if (type) {
    type.id = row.type?.id ?? 0;
    type.name = row.type?.name ?? '';
  }
  return {
    id: row.id,
    name: row.name,
    typeId: row.typeId,
    type: type,
    email: row.email,
    password: row.password,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    isActive: row.isActive,
    salary: row.salary?.toNumber() ?? null,
    hoursToWorkPerDay: row.hoursToWorkPerDay,
    employmentStartDate: row.employmentStartDate,
    startWorkAt: row.startWorkAt,
    endWorkAt: row.endWorkAt,
    weight: row.weight?.toNumber() ?? null,
    height: row.height?.toNumber() ?? null,
    gender: row.gender,
    birthDate: row.birthDate,
    diet: row.diet,
    trainingPlan: row.trainingPlan,
    medicalHistory: row.medicalHistory,
    allergies: row.allergies,
    medications: row.medications,
    medicalConditions: row.medicalConditions,
    document: row.document,
  };
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async loadFacilities(
    userId: number,
    clubId: number,
    userTypeId: number,
  ): Promise<FacilityNavigation[]> {
    const links = await this.prisma.facility_workers.findMany({
      where: { userId, clubId, userTypeId },
      include: {
        facility: {
          include: {
            user: { include: { type: true } },
            facility_workers: { include: { user: { include: { type: true } } } },
            facilities_membership: { include: { type: true } },
          },
        },
      },
    });

    return links.map(({ facility: f }): FacilityNavigation => {
      const toUserNav = (u: {
        id: number;
        name: string;
        email: string | null;
        createdAt: Date;
        deletedAt: Date | null;
        isActive: boolean;
        type: { id: number; name: string };
      }) => ({
        id: u.id,
        name: u.name,
        type: { id: u.type.id, name: u.type.name },
        email: u.email,
        createdAt: u.createdAt,
        deletedAt: u.deletedAt,
        isActive: u.isActive,
      });

      const assistants = f.facility_workers
        .filter((fw) => fw.user.id !== f.ResponsibleWorkerUserId)
        .map((fw) => toUserNav(fw.user));

      return {
        id: f.id,
        type: f.type,
        capacity: f.capacity,
        isActive: f.isActive,
        responsibleWorker: f.user ? toUserNav(f.user) : null,
        assistantWorkers: assistants.length > 0 ? assistants : null,
        membershipTypes: f.facilities_membership.map((fm) => ({
          id: fm.type.id,
          name: fm.type.name,
          price: Number(fm.type.price),
        })),
      };
    });
  }

  private async attachFacilities(
    userResponse: UserResponseDto,
    userId: number,
    clubId: number,
    typeId: number,
  ): Promise<void> {
    if (typeId !== 1) return;
    userResponse.facilities = await this.loadFacilities(userId, clubId, typeId);
  }

  private userToNav(user: UserWithTypeRow): UserNavigation {
    return {
      id: user.id,
      name: user.name,
      type: { id: user.type.id, name: user.type.name },
      email: user.email,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      isActive: user.isActive,
    };
  }

  private membershipTypeToNav(
    membershipType: MembershipTypeFromPrisma,
  ): MembershipTypeNavigation {
    return {
      id: membershipType.id,
      name: membershipType.name,
      price: Number(membershipType.price),
    };
  }

  private workingDayToNav(workingDay: WorkingDayRow): WorkingDayNavigation {
    return {
      id: workingDay.id,
      dayOfWeek: workingDay.dayOfWeek,
    };
  }

  private datetimeScheduleToNavigation(
    schedule: DatetimeScheduledActivityRow,
  ): DatetimeScheduledActivityNavigation {
    return {
      hourStart: schedule.hourStart,
      hourEnd: schedule.hourEnd,
      workingDay: this.workingDayToNav(schedule.working_day),
    };
  }

  private async scheduledActivityToNavigation(
    schedule: ScheduledActivityQueryRow,
  ): Promise<ScheduledActivityNavigation> {
    const responsibleUser = await this.prisma.users.findFirst({
      where: {
        id: schedule.userId,
        clubId: schedule.clubId,
        typeId: schedule.userTypeId,
      },
      include: { type: true },
    });

    if (!responsibleUser?.type) {
      throw new Error(
        `Trabajador responsable no encontrado para la actividad rutinaria ${schedule.id}`,
      );
    }

    return {
      id: schedule.id,
      clubId: schedule.clubId,
      membershipTypes: schedule.scheduled_activities_membership_types.map((m) =>
        this.membershipTypeToNav(m.membership_type),
      ),
      responsibleWorker: this.userToNav(responsibleUser),
      assistantWorkers: schedule.scheduled_activities_assistant_workers.map((a) =>
        this.userToNav(a.user),
      ),
      datetimeScheduledActivities: schedule.datetime_scheduled_activities.map((d) =>
        this.datetimeScheduleToNavigation(d),
      ),
    };
  }

  private async loadScheduleActivities(
    userId: number,
    clubId: number,
    userTypeId: number,
  ): Promise<ScheduledActivityNavigation[]> {
    const [asMemberLinks, asResponsible] = await Promise.all([
      this.prisma.scheduled_activities_members.findMany({
        where: { userId, clubId, userTypeId },
        include: {
          scheduled_activities: {
            include: {
              scheduled_activities_assistant_workers: {
                include: { user: { include: { type: true } } },
              },
              scheduled_activities_membership_types: { include: { membership_type: true } },
              datetime_scheduled_activities: { include: { working_day: true } },
            },
          },
        },
      }),
      this.prisma.scheduled_activities.findMany({
        where: { userId, clubId, userTypeId },
        include: {
          scheduled_activities_assistant_workers: {
            include: { user: { include: { type: true } } },
          },
          scheduled_activities_membership_types: { include: { membership_type: true } },
          datetime_scheduled_activities: { include: { working_day: true } },
        },
      }),
    ]);

    const scheduleMap = new Map<number, ScheduledActivityNavigation>();

    for (const link of asMemberLinks) {
      const s = link.scheduled_activities;
      scheduleMap.set(s.id, await this.scheduledActivityToNavigation(s));
    }

    for (const s of asResponsible) {
      scheduleMap.set(
        s.id,
        await this.scheduledActivityToNavigation(s),
      );
    }

    return [...scheduleMap.values()];
  }

  private async attachScheduleActivities(
    userResponse: UserResponseDto,
    userId: number,
    clubId: number,
    typeId: number,
  ): Promise<void> {
    userResponse.scheduleActivities = await this.loadScheduleActivities(
      userId,
      clubId,
      typeId,
    );
  }

  private async createNumerator(
    name: string,
    clubId: number,
  ): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({
      where: { name, clubId },
    });
    if (existNumerator) {
      return await this.prisma.numerator.update({
        where: { id: existNumerator.id },
        data: { value: existNumerator.value + 1 },
      });
    }
    return await this.prisma.numerator.create({
      data: { name, clubId, value: 1 },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const data: Prisma.usersUncheckedCreateInput = {
      id: 0,
      name: createUserDto.name,
      typeId: createUserDto.typeId,
      isActive: createUserDto.isActive,
      clubId: createUserDto.clubId,
      document: createUserDto.document,
    };
    const numerator = await this.createNumerator(
      'userId',
      createUserDto.clubId,
    );
    data.id = numerator.value;
    if (createUserDto.email != null) data.email = createUserDto.email;
    if (createUserDto.password != null) data.password = createUserDto.password;
    if (createUserDto.salary != null) data.salary = createUserDto.salary;
    if (createUserDto.hoursToWorkPerDay != null)
      data.hoursToWorkPerDay = createUserDto.hoursToWorkPerDay;
    if (createUserDto.employmentStartDate != null)
      data.employmentStartDate = createUserDto.employmentStartDate;
    if (createUserDto.startWorkAt != null)
      data.startWorkAt = createUserDto.startWorkAt;
    if (createUserDto.endWorkAt != null)
      data.endWorkAt = createUserDto.endWorkAt;
    if (createUserDto.weight != null) data.weight = createUserDto.weight;
    if (createUserDto.height != null) data.height = createUserDto.height;
    if (createUserDto.gender != null) data.gender = createUserDto.gender;
    if (createUserDto.birthDate != null)
      data.birthDate = createUserDto.birthDate;
    if (createUserDto.diet != null) data.diet = createUserDto.diet;
    if (createUserDto.trainingPlan != null)
      data.trainingPlan = createUserDto.trainingPlan;
    if (createUserDto.medicalHistory != null)
      data.medicalHistory = createUserDto.medicalHistory;
    if (createUserDto.allergies != null)
      data.allergies = createUserDto.allergies;
    if (createUserDto.medications != null)
      data.medications = createUserDto.medications;
    if (createUserDto.medicalConditions != null)
      data.medicalConditions = createUserDto.medicalConditions;

    const created = await this.prisma.users.create({
      data,
      include: { type: true, memberships: { include: { type: true } } },
    });
    const userResponse = mapRow(created);
    userResponse.membership = getLastMembership(created.memberships);
    await this.attachFacilities(
      userResponse,
      created.id,
      createUserDto.clubId,
      created.typeId,
    );
    await this.attachScheduleActivities(
      userResponse,
      created.id,
      createUserDto.clubId,
      created.typeId,
    );
    return userResponse;
  }

  async findAll(clubId: number): Promise<UserResponseDto[]> {
    const users = await this.prisma.users.findMany({
      where: { clubId },
      include: { type: true, memberships: { include: { type: true } } },
    });

    return Promise.all(
      users.map(async (user) => {
        const userResponse = mapRow(user);
        userResponse.membership = getLastMembership(user.memberships);
        await this.attachFacilities(userResponse, user.id, clubId, user.typeId);
        await this.attachScheduleActivities(
          userResponse,
          user.id,
          clubId,
          user.typeId,
        );
        return userResponse;
      }),
    );
  }

  async findById(
    queryUserRequestDto: QueryUserRequestDto,
  ): Promise<UserResponseDto | null> {
    const { clubId, userId, typeId } = queryUserRequestDto;
    const user = await this.prisma.users.findUnique({
      where: { id_clubId_typeId: { id: userId, clubId, typeId } },
      include: { type: true, memberships: { include: { type: true } } },
    });
    if (!user) return null;
    const userResponse = mapRow(user);
    userResponse.membership = getLastMembership(user.memberships);
    await this.attachFacilities(userResponse, user.id, clubId, user.typeId);
    await this.attachScheduleActivities(userResponse, user.id, clubId, user.typeId);
    return userResponse;
  }

  async findByEmail(
    email: string,
    clubId: number,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.users.findFirst({
      where: { email, clubId },
      include: { memberships: { include: { type: true } } },
    });
    if (!user) return null;
    const userResponse = mapRow(user);
    userResponse.membership = getLastMembership(user.memberships);
    await this.attachFacilities(userResponse, user.id, clubId, user.typeId);
    await this.attachScheduleActivities(userResponse, user.id, clubId, user.typeId);
    return userResponse;
  }

  async findByDocument(
    document: string,
    clubId: number,
  ): Promise<UserResponseDto | null> {
    const user = await this.prisma.users.findFirst({
      where: { document, clubId },
    });
    if (!user) return null;
    const userResponse = mapRow(user);
    await this.attachFacilities(userResponse, user.id, clubId, user.typeId);
    await this.attachScheduleActivities(userResponse, user.id, clubId, user.typeId);
    return userResponse;
  }

  async existsTypeId(typeId: number): Promise<boolean> {
    const row = await this.prisma.user_type.findUnique({
      where: { id: typeId },
    });
    return row != null;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updated = await this.prisma.users.update({
      where: {
        id_clubId_typeId: {
          id,
          clubId: updateUserDto.clubId,
          typeId: updateUserDto.typeId,
        },
      },
      data: updateUserDto as Prisma.usersUncheckedUpdateInput,
      include: { type: true, memberships: { include: { type: true } } },
    });
    const userResponse = mapRow(updated);
    userResponse.membership = getLastMembership(updated.memberships);
    await this.attachFacilities(
      userResponse,
      updated.id,
      updateUserDto.clubId,
      updated.typeId,
    );
    await this.attachScheduleActivities(
      userResponse,
      updated.id,
      updateUserDto.clubId,
      updated.typeId,
    );
    return userResponse;
  }

  async delete(queryUserRequestDto: QueryUserRequestDto): Promise<void> {
    const { clubId, userId, typeId } = queryUserRequestDto;
    await this.prisma.users.delete({
      where: { id_clubId_typeId: { id: userId, clubId, typeId } },
    });
  }
}
