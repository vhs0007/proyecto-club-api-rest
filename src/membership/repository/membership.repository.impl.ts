import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IMembershipRepository, MembershipResponse } from './membership.repository';
import { CreateMembershipDto } from '../dto/create-membership.dto';
import { UpdateMembershipDto } from '../dto/update-membership.dto';

@Injectable()
export class MembershipRepository implements IMembershipRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get membership() {
    return this.prisma.membership;
  }

  private get membershipType() {
    return this.prisma.membershipType;
  }

  private async getTypeIdById(id: number): Promise<number> {
    const row = await this.membershipType.findFirst({
      where: { id },
    });
    if (!row) throw new Error(`MembershipType not found: ${id}`);
    return row.id;
  }

  async create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponse> {
    const typeId = await this.getTypeIdById(createMembershipDto.type);
    const created = await this.membership.create({
      data: {
        typeId,
        price: createMembershipDto.price,
      },
      include: { type: true },
    });
    const price = typeof created.price === 'object' && 'toNumber' in created.price
      ? (created.price as { toNumber(): number }).toNumber()
      : Number(created.price);
    return { id: created.id, type: created.type.id as MembershipResponse['type'], price };
  }

  async findAll(): Promise<MembershipResponse[]> {
    const list = await this.membership.findMany({
      include: { type: true },
    });
    return list.map((row) => {
      const price = typeof row.price === 'object' && 'toNumber' in row.price
        ? (row.price as { toNumber(): number }).toNumber()
        : Number(row.price);
      return { id: row.id, type: row.type.id as MembershipResponse['type'], price };
    });
  }

  async findById(id: number): Promise<MembershipResponse | null> {
    const row = await this.membership.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!row) return null;
    const price = typeof row.price === 'object' && 'toNumber' in row.price
      ? (row.price as { toNumber(): number }).toNumber()
      : Number(row.price);
    return { id: row.id, type: row.type.id as MembershipResponse['type'], price };
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse> {
    const data: { typeId?: number; price?: number } = {};
    if (updateMembershipDto.type != null) {
      data.typeId = await this.getTypeIdById(updateMembershipDto.type);
    }
    if (updateMembershipDto.price != null) {
      data.price = updateMembershipDto.price;
    }
    const updated = await this.membership.update({
      where: { id },
      data,
      include: { type: true },
    });
    const price = typeof updated.price === 'object' && 'toNumber' in updated.price
      ? (updated.price as { toNumber(): number }).toNumber()
      : Number(updated.price);
    return { id: updated.id, type: updated.type.id as MembershipResponse['type'], price };
  }

  async delete(id: number): Promise<void> {
    await this.membership.delete({ where: { id } });
  }
}
