import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IUsersRepository } from './users.repository';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const created = await this.prisma.users.create({ data: createUserDto });
    return {
      ...createUserDto,
      ...(created.id && { id: created.id }),
    };
  }

  async findAll(): Promise<CreateUserDto[]> {
    return this.prisma.users.findMany().then((users) => users.map((user) => ({
      ...user,
      salary: user.salary?.toNumber() ?? null,
      weight: user.weight?.toNumber() ?? null,
      height: user.height?.toNumber() ?? null,
    })));
  }

  async findById(id: number): Promise<CreateUserDto | null> {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      return null;
    }
    return {
      ...user,
      salary: user?.salary?.toNumber() ?? null,
      weight: user?.weight?.toNumber() ?? null,
      height: user?.height?.toNumber() ?? null,
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<CreateUserDto> {
    const updated = await this.prisma.users.update({
      where: { id },
      data: updateUserDto,
    });
    return {
      ...updated,
      salary: updated.salary?.toNumber() ?? null,
      weight: updated.weight?.toNumber() ?? null,
      height: updated.height?.toNumber() ?? null,
    } as CreateUserDto;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}

