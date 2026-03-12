import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Activity } from './entities/activity.entity';
import { Facility } from '../facilities/entities/facility.entity';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import type { ActivityResponse } from './repository/activitities.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(
    private readonly activitiesRepository: ActivitiesRepository,
    private readonly prisma: PrismaService,
  ) {}

  private mapResponseToActivity(res: ActivityResponse): Activity {
    return new Activity({
      id: res.id,
      name: res.name,
      type: res.type,
      startAt: res.startAt,
      endAt: res.endAt,
      userId: res.userId,
      cost: res.cost,
      facility: new Facility({ id: res.facilityId }),
      isActive: res.isActive,
    });
  }

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const user = await this.prisma.users.findUnique({ where: { id: createActivityDto.userId } });
    if (!user) throw new BadRequestException('User not found');
    const facility = await this.prisma.facilities.findUnique({ where: { id: createActivityDto.facilityId } });
    if (!facility) throw new BadRequestException('Facility not found');
    if (new Date(createActivityDto.startAt) >= new Date(createActivityDto.endAt)) {
      throw new BadRequestException('startAt must be before endAt');
    }
    const res = await this.activitiesRepository.create(createActivityDto);
    return this.mapResponseToActivity(res);
  }

  async findAll(): Promise<Activity[]> {
    const list = await this.activitiesRepository.findAll();
    return list.map((r) => this.mapResponseToActivity(r));
  }

  async findOne(id: number): Promise<Activity> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    return this.mapResponseToActivity(row);
  }

  async update(id: number, updateActivityDto: UpdateActivityDto): Promise<Activity> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    if (updateActivityDto.userId !== undefined) {
      const user = await this.prisma.users.findUnique({ where: { id: updateActivityDto.userId } });
      if (!user) throw new BadRequestException('User not found');
    }
    if (updateActivityDto.facilityId !== undefined) {
      const facility = await this.prisma.facilities.findUnique({ where: { id: updateActivityDto.facilityId } });
      if (!facility) throw new BadRequestException('Facility not found');
    }
    const startAt = updateActivityDto.startAt !== undefined ? new Date(updateActivityDto.startAt) : new Date(row.startAt);
    const endAt = updateActivityDto.endAt !== undefined ? new Date(updateActivityDto.endAt) : new Date(row.endAt);
    if (startAt >= endAt) throw new BadRequestException('startAt must be before endAt');
    const updated = await this.activitiesRepository.update(id, updateActivityDto);
    return this.mapResponseToActivity(updated);
  }

  async remove(id: number): Promise<Activity> {
    const row = await this.activitiesRepository.findById(id);
    if (!row) throw new NotFoundException('Activity not found');
    await this.activitiesRepository.delete(id);
    return this.mapResponseToActivity(row);
  }
}
