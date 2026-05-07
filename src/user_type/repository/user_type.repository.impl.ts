import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IUserTypeRepository } from './user_type.repository';
import { UserTypeResponseDto } from '../dto/response/user-type-response.dto';

@Injectable()
export class UserTypeRepository implements IUserTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserTypeResponseDto[]> {
    const list = await this.prisma.user_type.findMany();
    return list.map((row) => ({
      id: row.id,
      name: row.name,
    }));
  }

  async findById(id: number): Promise<UserTypeResponseDto | null> {
    const row = await this.prisma.user_type.findUnique({ where: { id } });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
    };
  }

  async create(data: { name: string }): Promise<UserTypeResponseDto> {
    const row = await this.prisma.user_type.create({
      data: { name: data.name },
    });
    return { id: row.id, name: row.name };
  }

  // async update(id: number, data: UpdateUserTypeData): Promise<UserTypeResponse> {
  //   const updateData: { name?: string } = {};
  //   if (data.name !== undefined) updateData.name = data.name;
  //   const row = await this.prisma.user_type.update({
  //     where: { id },
  //     data: updateData,
  //   });
  //   return { id: row.id, name: row.name };
  // }

  // async delete(id: number): Promise<void> {
  //   await this.prisma.user_type.delete({ where: { id } });
  // }
}
