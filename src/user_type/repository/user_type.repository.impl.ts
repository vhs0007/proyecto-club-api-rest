import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IUserTypeRepository,
  UserTypeResponse,
  UpdateUserTypeData,
} from './user_type.repository';

@Injectable()
export class UserTypeRepository implements IUserTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(clubId: number): Promise<UserTypeResponse[]> {
    const list = await this.prisma.user_type.findMany({ where: { clubId } });
    return list.map((row) => ({
      id: row.id,
      name: row.name,
      clubId: row.clubId,
    }));
  }

  async findById(id: number): Promise<UserTypeResponse | null> {
    const row = await this.prisma.user_type.findUnique({ where: { id } });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      clubId: row.clubId,
    };
  }

   async create(data: { name: string, clubId: number }): Promise<UserTypeResponse> {
     const row = await this.prisma.user_type.create({ data: { name: data.name, clubId: data.clubId } });
     return { id: row.id, name: row.name, clubId: row.clubId };
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
