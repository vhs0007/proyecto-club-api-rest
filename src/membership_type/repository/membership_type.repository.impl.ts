import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { numerator } from '@prisma/client';
import type {
  IMembershipTypeRepository,
  UpdateMembershipTypeData,
} from './membership_type.repository';
import { QueryMembershipTypeRequestDto } from '../dto/request/query-membership_type.request.dto';
import { MembershipTypeResponseDto } from '../dto/response/membership_type-response.dto';

@Injectable()
export class MembershipTypeRepository implements IMembershipTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toNumber(value: unknown): number {
    if (value != null && typeof value === 'object' && 'toNumber' in value) {
      return (value as { toNumber(): number }).toNumber();
    }
    return Number(value);
  }

  private async generateNumerator(clubId: number): Promise<numerator> {
    const existNumerator = await this.prisma.numerator.findFirst({
      where: { name: 'membershipTypeId', clubId },
    });
    if (existNumerator) {
      return await this.prisma.numerator.update({
        where: { id: existNumerator.id },
        data: { value: existNumerator.value + 1 },
      });
    }
    const numerator = await this.prisma.numerator.create({
      data: {
        name: 'membershipTypeId',
        clubId,
        value: 1,
      },
    });
    return numerator;
  }

  async findAll(clubId: number): Promise<MembershipTypeResponseDto[]> {
    const list = await this.prisma.membership_type.findMany({
      where: { clubId },
    });
    return list.map((row) => ({
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    }));
  }

  async findById(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
  ): Promise<MembershipTypeResponseDto | null> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    const row = await this.prisma.membership_type.findUnique({
      where: { id_clubId: { id: id, clubId: clubId } },
    });
    if (!row) return null;
    return {
      id: row.id,
      name: row.name,
      price: this.toNumber(row.price),
    };
  }

  async create(data: {
    id: number | null;
    name: string;
    price: number;
    clubId: number;
  }): Promise<MembershipTypeResponseDto> {
    const numerator = await this.generateNumerator(data.clubId);
    data.id = numerator.value;
    const row = await this.prisma.membership_type.create({
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        clubId: data.clubId,
      },
    });
    return { id: row.id, name: row.name, price: this.toNumber(row.price) };
  }

  async update(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
    data: UpdateMembershipTypeData,
  ): Promise<MembershipTypeResponseDto> {
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

  async delete(
    queryMembershipTypeRequestDto: QueryMembershipTypeRequestDto,
  ): Promise<void> {
    const { clubId, id } = queryMembershipTypeRequestDto;
    await this.prisma.membership_type.delete({
      where: { id_clubId: { id: id, clubId: clubId } },
    });
  }
}
