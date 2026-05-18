import { BadRequestException, Injectable } from '@nestjs/common';
import { numerator, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IUsersRepository } from './users.repository';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UserTypeResponseDto } from '../../user_type/dto/response/user-type-response.dto';
import { membershipNavigation } from './users.repository';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';
import { QueryUserRequestDto } from '../dto/request/query-user.request.dto';
import { UserResponseDto } from '../dto/response/user.response.dto';

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
    return userResponse;
    //te prometo que fue necesario
  }

  async findAll(clubId: number): Promise<UserResponseDto[]> {
    const users = await this.prisma.users.findMany({
      where: { clubId },
      include: { type: true, memberships: { include: { type: true } } },
    });

    const usersConMembership = users.map((user) => {
      const userResponse = mapRow(user);
      userResponse.membership = getLastMembership(user.memberships);
      return userResponse;
    });
    return usersConMembership;
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
    return mapRow(user);
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
    return userResponse;
  }

  async delete(queryUserRequestDto: QueryUserRequestDto): Promise<void> {
    const { clubId, userId, typeId } = queryUserRequestDto;
    await this.prisma.users.delete({
      where: { id_clubId_typeId: { id: userId, clubId, typeId } },
    });
  }
}
