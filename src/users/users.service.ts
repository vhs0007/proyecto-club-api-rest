import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserResponseDto } from './dto/response/user.response.dto';
import { CreateUserDto } from './dto/request/create-user.request.dto';
import { UpdateUserDto } from './dto/request/update-user.request.dto';
import { Athlete } from './entities/athlete.entity';
import { Member } from './entities/member.entity';
import { Worker } from './entities/worker.entity';
import { UserType } from './entities/user.entity';
import { UsersRepository } from './repository/users.repository.impl';
import { QueryUserRequestDto } from './dto/request/query-user.request.dto';

const SALT_ROUNDS = 10;

async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export type UserEntity = Member | Athlete | Worker;

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    
    const existingByDocument = await this.usersRepository.findByDocument(createUserDto.document, createUserDto.clubId);
    if (existingByDocument) throw new ConflictException('Document already in use');

    if (createUserDto.email != null && createUserDto.email.trim() !== '') {
      const existingByEmail = await this.usersRepository.findByEmail(createUserDto.email, createUserDto.clubId);
      if (existingByEmail) throw new ConflictException('Email already in use');
    }

    const typeExists = await this.usersRepository.existsTypeId(createUserDto.typeId);
    if (!typeExists) throw new BadRequestException('Invalid typeId');

    if (createUserDto.typeId === UserType.ATHLETE) {
      
      if (createUserDto.gender != null && createUserDto.gender.trim() !== '') {
        const g = createUserDto.gender.toLowerCase();
        if (g !== 'masculino' && g !== 'femenino') throw new BadRequestException('gender must be masculino or femenino');
      }

      if (createUserDto.birthDate != null) {
        if (new Date(createUserDto.birthDate) > new Date()) throw new BadRequestException('birthDate cannot be in the future');
      }

    }

    if (createUserDto.typeId === UserType.WORKER && createUserDto.startWorkAt != null && createUserDto.endWorkAt != null) {

      if (new Date(createUserDto.startWorkAt) >= new Date(createUserDto.endWorkAt)) throw new BadRequestException('startWorkAt must be before endWorkAt');
    
    }
    const dataToCreate = { ...createUserDto };

    if (dataToCreate.password != null && dataToCreate.password.trim() !== '') {
      dataToCreate.password = await hashPassword(dataToCreate.password);
    }

    const res = await this.usersRepository.create(dataToCreate);
    return res;
  }

  async findAll(clubId: number): Promise<UserResponseDto[]> {
    const list = await this.usersRepository.findAll(clubId);
    return list;
  }

  async findOne(queryUserRequestDto: QueryUserRequestDto): Promise<UserResponseDto> {
    const row = await this.usersRepository.findById(queryUserRequestDto);
    if (!row) throw new NotFoundException('User not found');
    return row;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const { clubId } = updateUserDto;
    const existing = await this.usersRepository.findById({ clubId, userId: id, typeId: updateUserDto.typeId });
    if (!existing) throw new NotFoundException('User not found');
    if (updateUserDto.email != null && updateUserDto.email.trim() !== '') {
      const byEmail = await this.usersRepository.findByEmail(updateUserDto.email, clubId);
      if (byEmail != null && byEmail.id !== id) throw new ConflictException('Email already in use');
    }
    const updateData = { ...updateUserDto };
    if (updateData.password != null && updateData.password.trim() !== '') {
      updateData.password = await hashPassword(updateData.password);
    } else {
      delete updateData.password;
    }
    const updated = await this.usersRepository.update(id, updateData);
    return updated;
  }

  async remove(queryUserRequestDto: QueryUserRequestDto): Promise<UserResponseDto> {
    const row = await this.usersRepository.findById(queryUserRequestDto);
    if (!row) throw new NotFoundException('User not found');
    await this.usersRepository.delete(queryUserRequestDto);
    return row;
  }
}
