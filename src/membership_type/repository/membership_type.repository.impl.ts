import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IMembershipTypeRepository,
  MembershipTypeResponse,
  UpdateMembershipTypeData,
} from './membership_type.repository';

@Injectable()
export class MembershipTypeRepository implements IMembershipTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: unknown): number {
    if (value != null && typeof value === 'object' && 'toNumber' in value) {
      return (value as { toNumber(): number }).toNumber();
    }
    return Number(value);
  }

  async findAll(): Promise<MembershipTypeResponse[]> {
    const list = await this.prisma.membershipType.findMany();
    return list.map((row) => ({
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    }));
  }

  async findById(id: number): Promise<MembershipTypeResponse | null> {
    const row = await this.prisma.membershipType.findUnique({ where: { id } });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    };
  }

  // async create(data: { name: string; price: number }): Promise<MembershipTypeResponse> {
  //   const row = await this.prisma.membershipType.create({ data: { name: data.name, price: data.price } });
  //   return { id: row.id, name: row.name, price: this.toNumber(row.price) };
  // }

  // async update(id: number, data: UpdateMembershipTypeData): Promise<MembershipTypeResponse> {
  //   const updateData: { name?: string; price?: number } = {};
  //   if (data.name !== undefined) updateData.name = data.name;
  //   if (data.price !== undefined) updateData.price = data.price;
  //   const row = await this.prisma.membershipType.update({
  //     where: { id },
  //     data: updateData,
  //   });
  //   return {
  //     id: row.id,
  //     name: row.name,
  //     price: this.toNumber(row.price),
  //   };
  // }

  // async delete(id: number): Promise<void> {
  //   await this.prisma.membershipType.delete({ where: { id } });
  // }
}
