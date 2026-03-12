import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IUsersRepository, UserResponse } from './users.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

function mapRow(row: {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  roleId: number;
  salary?: { toNumber(): number } | null;
  hoursToWorkPerDay: number | null;
  startWorkAt: Date | null;
  endWorkAt: Date | null;
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
}): UserResponse {
  return {
    id: row.id,
    name: row.name,
    typeId: row.typeId,
    email: row.email,
    password: row.password,
    createdAt: row.createdAt,
    deletedAt: row.deletedAt,
    isActive: row.isActive,
    roleId: row.roleId,
    salary: row.salary?.toNumber() ?? null,
    hoursToWorkPerDay: row.hoursToWorkPerDay,
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
    const created = await this.prisma.users.create({ data: createUserDto as Prisma.usersUncheckedCreateInput });
    return mapRow(created);
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.prisma.users.findMany();
    return users.map(mapRow);
  }

  async findById(id: number): Promise<UserResponse | null> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) return null;
    return mapRow(user);
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

  async existsRoleId(roleId: number): Promise<boolean> {
    const row = await this.prisma.user_role.findUnique({ where: { id: roleId } });
    return row != null;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const updated = await this.prisma.users.update({
      where: { id },
      data: updateUserDto as Prisma.usersUncheckedUpdateInput,
    });
    return mapRow(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}
