import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Athlete, Gender } from './entities/athlete.entity';
import { Member, MemberRole } from './entities/member.entity';
import { Worker, WorkerRole } from './entities/worker.entity';
import { UserType } from './entities/user.entity';
import type { UserResponse } from './repository/users.repository';
import { UsersRepository } from './repository/users.repository.impl';

export type UserEntity = Member | Athlete | Worker;

function mapResponseToUser(res: UserResponse): UserEntity {
  const base = {
    id: res.id,
    name: res.name,
    createdAt: res.createdAt,
    email: res.email,
    password: res.password,
    updatedAt: null as Date | null,
    deletedAt: res.deletedAt,
    isActive: res.isActive,
  };
  const role = res.roleId as MemberRole | WorkerRole;

  if (res.typeId === UserType.WORKER) {
    return new Worker({
      ...base,
      type: UserType.WORKER,
      role: role as WorkerRole,
      salary: res.salary ?? 0,
      hoursToWorkPerDay: res.hoursToWorkPerDay,
      startWorkAt: res.startWorkAt ?? new Date(),
      endWorkAt: res.endWorkAt ?? new Date(),
    });
  }

  if (res.typeId === UserType.ATHLETE) {
    return new Athlete({
      ...base,
      type: UserType.ATHLETE,
      role: role as MemberRole,
      weight: res.weight ?? 0,
      height: res.height ?? 0,
      gender: (res.gender as Gender) ?? Gender.MALE,
      birthDate: res.birthDate ?? new Date(),
      diet: res.diet,
      trainingPlan: res.trainingPlan,
      medicalHistory: res.medicalHistory,
      allergies: res.allergies,
      medications: res.medications,
      medicalConditions: res.medicalConditions,
    });
  }

  return new Member({
    ...base,
    type: UserType.MEMBER,
    role: role as MemberRole,
  });
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const res = await this.usersRepository.create(createUserDto);
    return mapResponseToUser(res);
  }

  async findAll(): Promise<UserEntity[]> {
    const list = await this.usersRepository.findAll();
    return list.map(mapResponseToUser);
  }

  async findOne(id: number): Promise<UserEntity> {
    const row = await this.usersRepository.findById(id);
    if (!row) throw new NotFoundException('User not found');
    return mapResponseToUser(row);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const existing = await this.usersRepository.findById(id);
    if (!existing) throw new NotFoundException('User not found');
    const updated = await this.usersRepository.update(id, updateUserDto);
    return mapResponseToUser(updated);
  }

  async remove(id: number): Promise<UserEntity> {
    const row = await this.usersRepository.findById(id);
    if (!row) throw new NotFoundException('User not found');
    await this.usersRepository.delete(id);
    return mapResponseToUser(row);
  }
}
