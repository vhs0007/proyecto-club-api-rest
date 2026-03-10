import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';
import { Activity } from './entities/activity.entity';
import { Facility } from '../facilities/entities/facility.entity';
import { ActivitiesRepository } from './repository/activities.repository.impl';
import type { ActivityResponse } from './repository/activitities.repository';

@Injectable()
export class ActivitiesService {
  constructor(private readonly activitiesRepository: ActivitiesRepository) {}

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
