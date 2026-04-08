import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IMembershipRepository, MembershipResponse } from './membership.repository';
import { CreateMembershipDto } from '../dto/request/create-membership.dto';
import { UpdateMembershipDto } from '../dto/request/update-membership.dto';
import { MembershipType } from 'src/membership_type/entities/membership_type.entity';
import { numerator, Prisma } from '@prisma/client';
import { QueryMembershipRequestDto } from '../dto/request/query-membership.request.dto';

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

  private async generateNumerator(clubId: number): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({ where: { name: 'membershipId', clubId } });
    if (existNumerator) {
      return await this.prisma.numerator.update({
        where: { id: existNumerator.id },
        data: { value: existNumerator.value + 1 },
      });
    }
    const numerator = await this.prisma.numerator.create({
      data: {
        name: 'membershipId',
        clubId,
        value: 1,
      },
    });
      return numerator;
  }



  async create(createMembershipDto: CreateMembershipDto): Promise<MembershipResponse> {
    const typeId = await this.getTypeIdById(createMembershipDto.type);
    const dateCreated = new Date();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    const numerator = await this.generateNumerator(createMembershipDto.clubId);
    const id = numerator.value;
    const created = await this.membership.create({
      data: { id, typeId, createdAt: dateCreated, userId: createMembershipDto.userId , expiration : expirationDate, clubId: createMembershipDto.clubId},
      include: { type: true, user: { include: { type: true } } },
    });
    
    return this.mapToMembershipResponse(created);
  }
  
  private mapToMembershipResponse(row: {
    id: number;
    typeId: number;
    expiration: Date;
    type: { id: number; name: string, price: Prisma.Decimal } | null;
    createdAt: Date;
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
    return { id: row.id, type, user, expiration : row.expiration , createdAt: row.createdAt};
  }

  async findAll(clubId: number): Promise<MembershipResponse[]> {
    const list = await this.membership.findMany({
      where: { clubId },
      include: { type: true, user: { include: { type: true } } },
    }); 
    return list.map((row) => this.mapToMembershipResponse(row));
  }

  async findById(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<MembershipResponse | null> {
    const { clubId, id } = queryMembershipRequestDto;
    const row = await this.membership.findUnique({
      where: { id_clubId: { id: id, clubId: clubId } },
      include: { type: true, user: { include: { type: true } } },
    });
    if (!row) return null;
    return this.mapToMembershipResponse(row);
  }

  async update(queryMembershipRequestDto: QueryMembershipRequestDto, updateMembershipDto: UpdateMembershipDto): Promise<MembershipResponse> {
    const { clubId, id } = queryMembershipRequestDto;
    const data: { typeId?: number; userId?: number } = {};
    if (updateMembershipDto.type != null) {
      data.typeId = await this.getTypeIdById(updateMembershipDto.type);
    }
    if (updateMembershipDto.userId != null) {
      data.userId = updateMembershipDto.userId;
    }
    const updated = await this.membership.update({
      where: { id_clubId: { id: id, clubId: clubId } },
      data,
      include: { type: true, user: { include: { type: true } } },
    });
    return this.mapToMembershipResponse(updated);
  }

  async delete(queryMembershipRequestDto: QueryMembershipRequestDto): Promise<void> {
    const { clubId, id } = queryMembershipRequestDto;
    await this.membership.delete({ where: { id_clubId: { id: id, clubId: clubId } } });
  }
}