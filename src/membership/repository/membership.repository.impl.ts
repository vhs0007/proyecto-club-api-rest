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
    return this.prisma.membership_type;
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
      data: { typeId, userId: createMembershipDto.userId },
      include: { type: true },
    });
    const type = created.type?.id ?? created.typeId;
    return { id: created.id, type };
  }

  async findAll(): Promise<MembershipResponse[]> {
    const list = await this.membership.findMany({
      include: { type: true },
    });
    return list.map((row) => ({ id: row.id, type: row.type?.id ?? row.typeId }));
  }

  async findById(id: number): Promise<MembershipResponse | null> {
    const row = await this.membership.findUnique({
      where: { id },
      include: { type: true },
    });
    if (!row) return null;
    return { id: row.id, type: row.type?.id ?? row.typeId };
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse> {
    const data: { typeId?: number; userId?: number } = {};
    if (updateMembershipDto.type != null) {
      data.typeId = await this.getTypeIdById(updateMembershipDto.type);
    }
    if (updateMembershipDto.userId != null) {
      data.userId = updateMembershipDto.userId;
    }
    const updated = await this.membership.update({
      where: { id },
      data,
      include: { type: true },
    });
    return { id: updated.id, type: updated.type?.id ?? updated.typeId };
  }

  async delete(id: number): Promise<void> {
    await this.membership.delete({ where: { id } });
  }
}
