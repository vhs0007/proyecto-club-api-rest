import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IExpirationRepository, ExpirationResponse } from './expiration.repository';
import { CreateExpirationDto } from '../dto/create-expiration.dto';
import { UpdateExpirationDto } from '../dto/update-expiration.dto';

@Injectable()
export class ExpirationRepository implements IExpirationRepository {
  constructor(private readonly prisma: PrismaService) {}

  private get expirations() {
    // Tabla expirations: id, memberId, expirationDate, membershipId (PrismaClient puede no tiparla hasta prisma generate)
    return (this.prisma as any).expirations;
  }

  async create(createExpirationDto: CreateExpirationDto): Promise<ExpirationResponse> {
    const created = await this.expirations.create({
      data: {
        memberId: createExpirationDto.socio.id,
        expirationDate: createExpirationDto.exp_date,
        membershipId: createExpirationDto.membership.id,
      },
      include: { member: true, membership: true },
    });
    return {
      id: created.id,
      socio: created.member as unknown as ExpirationResponse['socio'],
      exp_date: created.expirationDate,
      membership: created.membership as unknown as ExpirationResponse['membership'],
    };
  }

  async findAll(): Promise<ExpirationResponse[]> {
    const list = await this.expirations.findMany({
      include: { member: true, membership: true },
    });
    return list.map((row) => ({
      id: row.id,
      socio: row.member as unknown as ExpirationResponse['socio'],
      exp_date: row.expirationDate,
      membership: row.membership as unknown as ExpirationResponse['membership'],
    }));
  }

  async findById(id: number): Promise<ExpirationResponse | null> {
    const row = await this.expirations.findUnique({
      where: { id },
      include: { member: true, membership: true },
    });
    if (!row) return null;
    return {
      id: row.id,
      socio: row.member as unknown as ExpirationResponse['socio'],
      exp_date: row.expirationDate,
      membership: row.membership as unknown as ExpirationResponse['membership'],
    };
  }

  async update(id: number, updateExpirationDto: UpdateExpirationDto): Promise<ExpirationResponse> {
    const data: { memberId?: number; expirationDate?: Date; membershipId?: number } = {};
    if (updateExpirationDto.socio?.id != null) data.memberId = updateExpirationDto.socio.id;
    if (updateExpirationDto.exp_date != null) data.expirationDate = updateExpirationDto.exp_date;
    if (updateExpirationDto.membership?.id != null) data.membershipId = updateExpirationDto.membership.id;

    const updated = await this.expirations.update({
      where: { id },
      data,
      include: { member: true, membership: true },
    });
    return {
      id: updated.id,
      socio: updated.member as unknown as ExpirationResponse['socio'],
      exp_date: updated.expirationDate,
      membership: updated.membership as unknown as ExpirationResponse['membership'],
    };
  }

  async delete(id: number): Promise<void> {
    await this.expirations.delete({ where: { id } });
  }
}
