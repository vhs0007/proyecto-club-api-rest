import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Athlete, Gender } from './entities/athlete.entity';
import { Member, MemberRole } from './entities/member.entity';
import { Worker, WorkerRole } from './entities/worker.entity';
import { UserType } from './entities/user.entity';
import type { UserResponse } from './repository/users.repository';
import { UsersRepository } from './repository/users.repository.impl';

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

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

  if (res.typeId === UserType.WORKER) {
    return new Worker({
      ...base,
      type: UserType.WORKER,
      role: WorkerRole.ADMINISTRATIVE,
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
      role: MemberRole.ATHLETE,
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
    role: MemberRole.Standard,
  });
}

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    if (createUserDto.email != null && createUserDto.email.trim() !== '') {
      const existingByEmail = await this.usersRepository.findByEmail(createUserDto.email);
      if (existingByEmail) throw new ConflictException('Email already in use');
    }
    const typeExists = await this.usersRepository.existsTypeId(createUserDto.typeId);
    if (!typeExists) throw new BadRequestException('Invalid typeId');
    if (createUserDto.typeId === UserType.ATHLETE) {
      if (createUserDto.gender != null && createUserDto.gender.trim() !== '') {
        const g = createUserDto.gender.toLowerCase();
        if (g !== 'male' && g !== 'female') throw new BadRequestException('gender must be male or female');
      }
      if (createUserDto.birthDate != null) {
        if (new Date(createUserDto.birthDate) > new Date()) throw new BadRequestException('birthDate cannot be in the future');
      }
    }
    if (createUserDto.typeId === UserType.WORKER && createUserDto.startWorkAt != null && createUserDto.endWorkAt != null) {
      if (new Date(createUserDto.startWorkAt) >= new Date(createUserDto.endWorkAt))
        throw new BadRequestException('startWorkAt must be before endWorkAt');
    }
    const dataToCreate = { ...createUserDto };
    if (dataToCreate.password != null && dataToCreate.password.trim() !== '') {
      dataToCreate.password = await hashPassword(dataToCreate.password);
    }
    const res = await this.usersRepository.create(dataToCreate);
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
    if (updateUserDto.email != null && updateUserDto.email.trim() !== '') {
      const byEmail = await this.usersRepository.findByEmail(updateUserDto.email);
      if (byEmail != null && byEmail.id !== id) throw new ConflictException('Email already in use');
    }
    const updateData = { ...updateUserDto };
    if (updateData.password != null && updateData.password.trim() !== '') {
      updateData.password = await hashPassword(updateData.password);
    } else {
      delete updateData.password;
    }
    const updated = await this.usersRepository.update(id, updateData);
    return mapResponseToUser(updated);
  }

  async remove(id: number): Promise<UserEntity> {
    const row = await this.usersRepository.findById(id);
    if (!row) throw new NotFoundException('User not found');
    await this.usersRepository.delete(id);
    return mapResponseToUser(row);
  }
}
