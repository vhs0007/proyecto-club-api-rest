import {
  BadRequestException, Injectable, NotFoundException,
} from '@nestjs/common';
import { CreateActivitiesDto } from './dto/create-activities.dto';
import { UpdateActivitiesDto } from './dto/update-user.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  activities: Activity[] = [
    new Activity({
      id: 1,
      name: 'Soccer game',
      type: 'soccer,game,sport',
      startAt: new Date('2026-03-03T10:00:00'),
      endAt: new Date('2026-03-03T12:00:00'),
      userId: 1,
      cost: 100,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
    }),
    new Activity({
      id: 2,
      name: 'Basketball game',
      type: 'basketball,game,sport',
      startAt: new Date('2026-03-04T14:00:00'),
      endAt: new Date('2026-03-04T16:00:00'),
      userId: 2,
      cost: 100,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      isActive: true,
    }),
  ];

  private findById(id: number): Activity | null {
    const activity = this.activities.find((a) => a.id === id);
    if (activity) return activity;
    return null;
  }

  create(createActivitiesDto: CreateActivitiesDto): Activity {
    const now = new Date();
    const id = Math.max(0, ...this.activities.map((a) => a.id)) + 1;
    const activity = new Activity({
      ...createActivitiesDto,
      id,
      createdAt: createActivitiesDto.createdAt ?? now,
      updatedAt: null as Date | null,
      deletedAt: null as Date | null,
      isActive: createActivitiesDto.isActive ?? true,
    });
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

  update(id: number, updateActivitiesDto: UpdateActivitiesDto): Activity {
    const entity = this.findById(id);
    if (!entity) {
      throw new NotFoundException('Activity not found');
    }
    
    entity.name = updateActivitiesDto.name ?? entity.name;
    entity.type = updateActivitiesDto.type ?? entity.type;
    entity.startAt = updateActivitiesDto.startAt ?? entity.startAt;
    entity.endAt = updateActivitiesDto.endAt ?? entity.endAt;
    entity.userId = updateActivitiesDto.userId ?? entity.userId;
    entity.cost = updateActivitiesDto.cost ?? entity.cost;
    entity.isActive = updateActivitiesDto.isActive ?? entity.isActive;
    entity.updatedAt = new Date();
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

