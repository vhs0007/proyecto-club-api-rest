import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IExpirationRepository, ExpirationResponse } from './expiration.repository';
import { CreateExpirationDto } from '../dto/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/update-expiration.dto';

@Injectable()
export class ExpirationRepository implements IExpirationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get expirations() {
    return this.prisma.expirations;
  }

  async create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponse> {
    const created = await this.expirations.create({
      data: {
        memberId: createExpirationDto.memberId,
        expirationDate: createExpirationDto.expirationDate,
        membershipId: createExpirationDto.membershipId,
      },
    });
    const id = Number(created.id);
    return {
      id,
      memberId: created.memberId,
      expirationDate: created.expirationDate,
      membershipId: created.membershipId,
    };
  }

  async findAll(): Promise<ExpirationResponse[]> {
    const list = await this.expirations.findMany();
    return list.map((row) => ({
      id: row.id,
      memberId: row.memberId,
      expirationDate: row.expirationDate,
      membershipId: row.membershipId,
    }));
  }

  async findById(id: number): Promise<ExpirationResponse | null> {
    const row = await this.expirations.findUnique({
      where: { id },
    });
    if (!row) return null;
    return {
      id: row.id,
      memberId: row.memberId,
      expirationDate: row.expirationDate,
      membershipId: row.membershipId,
    };
  }

  async update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponse> {
    const data: { memberId?: number; expirationDate?: Date; membershipId?: number } = {};
    if (updateExpirationDto.memberId !== undefined) data.memberId = updateExpirationDto.memberId;
    if (updateExpirationDto.expirationDate !== undefined) data.expirationDate = updateExpirationDto.expirationDate;
    if (updateExpirationDto.membershipId !== undefined) data.membershipId = updateExpirationDto.membershipId;

    const updated = await this.expirations.update({
      where: { id },
      data,
    });
    return {
      id: updated.id,
      memberId: updated.memberId,
      expirationDate: updated.expirationDate,
      membershipId: updated.membershipId,
    };
  }

  async delete(id: number): Promise<void> {
    await this.expirations.delete({ where: { id } });
  }
}
