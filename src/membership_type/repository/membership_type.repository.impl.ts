import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IMembershipTypeRepository, MembershipTypeResponse } from './membership_type.repository';

@Injectable()
export class MembershipTypeRepository implements IMembershipTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<MembershipTypeResponse[]> {
    const list = await this.prisma.membershipType.findMany();
    return list.map((row) => ({ id: row.id, name: row.name }));
  }

  async findById(id: number): Promise<MembershipTypeResponse | null> {
    const row = await this.prisma.membershipType.findUnique({ where: { id } });
    if (!row) return null;
    return { id: row.id, name: row.name };
  }

  // async update(id: number, updateMembershipTypeDto: MembershipType): Promise<MembershipType> {
  //   return this.prisma.membershipType.update({ where: { id }, data: updateMembershipTypeDto });
  // }

  // async delete(id: number): Promise<void> {
  //   await this.prisma.membershipType.delete({ where: { id } });
  // }
}
