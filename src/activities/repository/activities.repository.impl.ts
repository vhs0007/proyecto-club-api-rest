import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository } from './activitities.repository';
import { CreateActivityDto } from '../dto/create-activities.dto';
import { UpdateActivityDto } from '../dto/update-activities.dto';
import { Activity } from '../entities/activity.entity';
import { Facility } from '../../facilities/entities/facility.entity';

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}


  async create(createActivityDto: CreateActivityDto): Promise<CreateActivityDto> {
    const { facilityId, isActive, ...rest } = createActivityDto;
    const created = await (this.prisma as any).activity.create({
      data: {
        ...rest,
        facilityId,
        isActive: isActive ?? true,
      },
      include: { facility: true },
    });
    return {
      ...createActivityDto,
      ...(facilityId && { facilityId }),
    };
  }

  async findAll(): Promise<CreateActivityDto[]> {
    const list = await (this.prisma as any).activity.findMany({
      include: { facility: true },
    });
    return list.map((row) => ({
      ...row,
      cost: row.cost.toNumber(),
      ...(row.facilityId && { facilityId: row.facilityId }),
    }));
  }

  async findById(id: number): Promise<CreateActivityDto | null> {
    const row = await (this.prisma as any).activity.findUnique({
      where: { id },
      include: { facility: true },
    });
    return row ? {
      ...row,
      cost: row.cost.toNumber(),
      ...(row.facilityId && { facilityId: row.facilityId }),
    } : null;
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<UpdateActivityDto> {
    const { id: _id, facilityId, ...rest } = updateActivityDto;
    const updated = await (this.prisma as any).activity.update({
      where: { id },
      data: {
        ...rest,
        ...(facilityId && { facilityId }),
      },
      include: { facility: true },
    });
    return {
      ...updateActivityDto,
      ...(facilityId && { facilityId }),
    };
  }

  async delete(id: number): Promise<void> {
    await (this.prisma as any).activity.delete({ where: { id } });
  }
}
