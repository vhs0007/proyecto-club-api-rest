import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository, ActivityResponse } from './activitities.repository';
import { CreateActivityDto } from '../dto/create-activities.dto';
import { UpdateActivityDto } from '../dto/update-activities.dto';

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapRow(row: { id: number; name: string; type: string; startAt: Date; endAt: Date; userId: number; cost: unknown; facilityId: number; isActive: boolean }): ActivityResponse {
    const cost = typeof row.cost === 'object' && row.cost !== null && 'toNumber' in row.cost
      ? (row.cost as { toNumber(): number }).toNumber()
      : Number(row.cost);
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      startAt: row.startAt,
      endAt: row.endAt,
      userId: row.userId,
      cost,
      facilityId: row.facilityId,
      isActive: row.isActive,
    };
  }

  async create(createActivityDto: CreateActivityDto): Promise<ActivityResponse> {
    const { facilityId, isActive, ...rest } = createActivityDto;
    const created = await this.prisma.activity.create({
      data: {
        ...rest,
        facilityId,
        isActive: isActive ?? true,
      },
      include: { facility: true },
    });
    return this.mapRow(created);
  }

  async findAll(): Promise<ActivityResponse[]> {
    const list = await this.prisma.activity.findMany({
      include: { facility: true },
    });
    return list.map((row) => this.mapRow(row));
  }

  async findById(id: number): Promise<ActivityResponse | null> {
    const row = await this.prisma.activity.findUnique({
      where: { id },
      include: { facility: true },
    });
    return row ? this.mapRow(row) : null;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<ActivityResponse> {
    const data: Record<string, unknown> = {};
    if (updateActivityDto.name !== undefined) data.name = updateActivityDto.name;
    if (updateActivityDto.type !== undefined) data.type = updateActivityDto.type;
    if (updateActivityDto.startAt !== undefined) data.startAt = updateActivityDto.startAt;
    if (updateActivityDto.endAt !== undefined) data.endAt = updateActivityDto.endAt;
    if (updateActivityDto.userId !== undefined) data.userId = updateActivityDto.userId;
    if (updateActivityDto.cost !== undefined) data.cost = updateActivityDto.cost;
    if (updateActivityDto.facilityId !== undefined) data.facilityId = updateActivityDto.facilityId;
    if (updateActivityDto.isActive !== undefined) data.isActive = updateActivityDto.isActive;
    const updated = await this.prisma.activity.update({
      where: { id },
      data,
      include: { facility: true },
    });
    return this.mapRow(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.activity.delete({ where: { id } });
  }
}
