import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IMembershipRepository, MembershipResponse } from './membership.repository';
import { CreateMembershipDto } from '../dto/request/create-membership.dto';
import { UpdateMembershipDto } from '../dto/request/update-membership.dto';
import { MembershipType } from 'src/membership_type/entities/membership_type.entity';
import { Prisma } from '@prisma/client';

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
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const created = await this.membership.create({
      data: { typeId, userId: createMembershipDto.userId , expiration : expirationDate },
      include: { type: true, user: { include: { type: true } } },
    });
    
    return this.mapToMembershipResponse(created);
  }
  
  private mapToMembershipResponse(row: {
    id: number;
    typeId: number;
    expiration: Date;
    type: { id: number; name: string, price: Prisma.Decimal } | null;
    user: {
      id: number;
      name: string;
      email: string | null;
      createdAt: Date;
      isActive: boolean;
      type: { id: number; name: string } | null;
    };
  }): MembershipResponse {
    const type =
      row.type != null ? { id: row.type.id, name: row.type.name, price: row.type.price } : { id: row.typeId, name: '', price: new Prisma.Decimal(0) };
    const u = row.user;
    const user = {
      id: u.id,
      name: u.name,
      email: u.email ?? '',
      createdAt: u.createdAt,
      isActive: u.isActive,
      type: u.type != null ? { id: u.type.id, name: u.type.name } : { id: 0, name: '' },
    };
    return { id: row.id, type, user, expiration : row.expiration };
  }

  async findAll(): Promise<MembershipResponse[]> {
    const list = await this.membership.findMany({
      include: { type: true, user: { include: { type: true } } },
    });
    return list.map((row) => this.mapToMembershipResponse(row));
  }

  async findById(id: number): Promise<MembershipResponse | null> {
    const row = await this.membership.findUnique({
      where: { id },
      include: { type: true, user: { include: { type: true } } },
    });
    if (!row) return null;
    return this.mapToMembershipResponse(row);
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
      include: { type: true, user: { include: { type: true } } },
    });
    return this.mapToMembershipResponse(updated);
  }

  async delete(id: number): Promise<void> {
    await this.membership.delete({ where: { id } });
  }
}