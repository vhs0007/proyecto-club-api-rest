import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activities.dto';
import { UpdateActivityDto } from './dto/update-activities.dto';

@Injectable()
export class ActivitiesService {
  activities: CreateActivityDto[] = [
    {
      id: 1,
      name: 'Soccer game',
      type: 'soccer,game,sport',
      startAt: new Date('2026-03-03T10:00:00'),
      endAt: new Date('2026-03-03T12:00:00'),
      userId: 1,
      cost: 100,
      facilityId: 1,
    },
    {
      id: 2,
      name: 'Basketball game',
      type: 'basketball,game,sport',
      startAt: new Date('2026-03-04T14:00:00'),
      endAt: new Date('2026-03-04T16:00:00'),
      userId: 2,
      cost: 100,
      facilityId: 2,
    },
  ];

  private findById(id: number): CreateActivityDto | null {
    const activity = this.activities.find((a) => a.id === id);
    if (activity) return activity;
    return null;
  }

  create(createActivityDto: CreateActivityDto): CreateActivityDto {
    const now = new Date();
    const id = Math.max(0, ...this.activities.map((a) => a.id ?? 0)) + 1;
    const activity = {
      ...createActivityDto,
      id,
      facilityId: createActivityDto.facilityId,
      createdAt: createActivityDto.createdAt ?? now,
    };
    this.activities.push(activity);
    return activity;
  }

  findAll() {
    return this.activities;
  }

  findOne(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Activity not found');
    }
    return entity;
  }

  update(id: number, updateActivityDto: UpdateActivityDto): CreateActivityDto {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Activity not found');
    }
    
    entity.name = updateActivityDto.name ?? entity.name;
    entity.type = updateActivityDto.type ?? entity.type;
    entity.startAt = updateActivityDto.startAt ?? entity.startAt;
    entity.endAt = updateActivityDto.endAt ?? entity.endAt;
    entity.userId = updateActivityDto.userId ?? entity.userId;
    entity.cost = updateActivityDto.cost ?? entity.cost;
    entity.facilityId = updateActivityDto.facilityId ?? entity.facilityId;
    entity.isActive = updateActivityDto.isActive ?? entity.isActive;
    return entity;
  }

  remove(id: number) {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Activity not found');
    }

    this.activities = this.activities.filter((a) => a.id !== id);
    return entity;
  }
}

