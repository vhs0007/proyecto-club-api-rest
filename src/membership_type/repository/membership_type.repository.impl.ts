import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IMembershipTypeRepository,
  MembershipTypeResponse,
  UpdateMembershipTypeData,
} from './membership_type.repository';
import { QueryMembershipTypeRequestDto } from '../dto/request/query-membership_type.request.dto';

@Injectable()
export class MembershipTypeRepository implements IMembershipTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: unknown): number {
    if (value != null && typeof value === 'object' && 'toNumber' in value) {
      return (value as { toNumber(): number }).toNumber();
    }
    return Number(value);
  }

  async findAll(clubId: number): Promise<MembershipTypeResponse[]> {
    const list = await this.prisma.membership_type.findMany({ where: { clubId }});
    return list.map((row) => ({
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    }));
  }

  async findById(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<MembershipTypeResponse | null> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    const row = await this.prisma.membership_type.findUnique({ where: { id_clubId: { id: id, clubId: clubId } }});
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    };
  }

   async create(data: { name: string; price: number; clubId: number }): Promise<MembershipTypeResponse> {
     const row = await this.prisma.membership_type.create({ data: { name: data.name, price: data.price, clubId: data.clubId } });
     return { id: row.id, name: row.name, price: this.toNumber(row.price) };
   }

  async update(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto, data: UpdateMembershipTypeData): Promise<MembershipTypeResponse> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    const updateData: { name?: string; price?: number } = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price;
    const row = await this.prisma.membership_type.update({
      where: { id_clubId: { id: id, clubId: clubId } },
      data: updateData,
    });
    return {
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    };
  }

  async delete(queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto): Promise<void> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    await this.prisma.membership_type.delete({ where: { id_clubId: { id: id, clubId: clubId } } });
  }
}
