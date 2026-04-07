import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IUsersRepository, UserResponse } from './users.repository';
import { UpdateUserDto } from '../dto/request/update-user.request.dto';
import { CreateUserDto } from '../dto/request/create-user.request.dto';
import { UserTypeResponseDto } from '../../user_type/dto/response/user-type-response.dto';
import { membershipNavigation } from './users.repository';
import { MembershipTypeResponseDto } from 'src/membership_type/dto/response/membership_type-response.dto';

interface UserRow {
  id: number;
  name: string;
  typeId: number;
  type?: UserTypeResponseDto;
  email: string | null;
  password: string | null;
  membership?: membershipNavigation[];
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
}

type MembershipWithTypeRow = {
  id: number;
  userId: number;
  expiration: Date;
  createdAt: Date;
  typeId: number;
  type: {
    id: number;
    name: string;
    price: Prisma.Decimal;
  } | null;
};

function mapMembership(row: MembershipWithTypeRow): membershipNavigation {
  const membershipType = new MembershipTypeResponseDto();
  membershipType.id = row.type?.id ?? row.typeId;
  membershipType.name = row.type?.name ?? '';
  membershipType.price = row.type?.price?.toNumber() ?? 0;

  return {
    id: row.id,
    expiration: row.expiration,
    createdAt: row.createdAt,
    membershipType,
  };
}

function mapRow(row: UserRow): UserResponse {
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
  };
}

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const data: Prisma.usersUncheckedCreateInput = {
      name: createUserDto.name,
      typeId: createUserDto.typeId,
      isActive: createUserDto.isActive,
      clubId: createUserDto.clubId,
      document: createUserDto.document,
    };
    if (createUserDto.email != null) data.email = createUserDto.email;
    if (createUserDto.password != null) data.password = createUserDto.password;
    if (createUserDto.salary != null) data.salary = createUserDto.salary;
    if (createUserDto.hoursToWorkPerDay != null) data.hoursToWorkPerDay = createUserDto.hoursToWorkPerDay;
    if (createUserDto.employmentStartDate != null) data.employmentStartDate = createUserDto.employmentStartDate;
    if (createUserDto.startWorkAt != null) data.startWorkAt = createUserDto.startWorkAt
    if (createUserDto.endWorkAt != null) data.endWorkAt = createUserDto.endWorkAt
    if (createUserDto.weight != null) data.weight = createUserDto.weight;
    if (createUserDto.height != null) data.height = createUserDto.height;
    if (createUserDto.gender != null) data.gender = createUserDto.gender;
    if (createUserDto.birthDate != null) data.birthDate = createUserDto.birthDate;
    if (createUserDto.diet != null) data.diet = createUserDto.diet;
    if (createUserDto.trainingPlan != null) data.trainingPlan = createUserDto.trainingPlan;
    if (createUserDto.medicalHistory != null) data.medicalHistory = createUserDto.medicalHistory;
    if (createUserDto.allergies != null) data.allergies = createUserDto.allergies;
    if (createUserDto.medications != null) data.medications = createUserDto.medications;
    if (createUserDto.medicalConditions != null) data.medicalConditions = createUserDto.medicalConditions;
   
    const created = await this.prisma.users.create({ data, include: { type: true, memberships: { include: { type: true } } } });
    const userResponse = mapRow(created);
    userResponse.membership = created.memberships.map((membership) => mapMembership(membership));
    return userResponse;
    //te prometo que fue necesario 
  }

  async findAll(clubId: number): Promise<UserResponse[]> {
    const users = await this.prisma.users.findMany({
      where: { clubId },
      include: { type: true, memberships: { include: { type: true } } },
    });

    const usersConMembership = users.map(user => {
      const userResponse = mapRow(user);
      userResponse.membership = user.memberships.map((membership) => mapMembership(membership));
      return userResponse;
    });
    return usersConMembership;
  }

  async findById(id: number): Promise<UserResponse | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: { type: true, memberships: { include: { type: true } } },
    });
    if (!user) return null;
    const userResponse = mapRow(user);
    userResponse.membership = user.memberships.map((membership) => mapMembership(membership));
    return userResponse;
  }

  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await this.prisma.users.findFirst({ where: { email } });
    if (!user) return null;
    return mapRow(user);
  }

  async existsTypeId(typeId: number): Promise<boolean> {
    const row = await this.prisma.user_type.findUnique({ where: { id: typeId } });
    return row != null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const updated = await this.prisma.users.update({
      where: { id },
      data: updateUserDto as Prisma.usersUncheckedUpdateInput,
      include: { type: true , memberships: { include: { type: true } } },
    });
    const userResponse = mapRow(updated);
    userResponse.membership = updated.memberships.map((membership) => mapMembership(membership));
    return userResponse;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}
