import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IActivitiesRepository } from './activitities.repository';
import { CreateActivityDto } from '../dto/create-activities.dto';
import { UpdateActivityDto } from '../dto/update-activities.dto';

@Injectable()
export class ActivitiesRepository implements IActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createActivityDto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: createActivityDto,
      include: { facility: true },
    });
  }

  findAll() {
    return this.prisma.activity.findMany({
      include: { facility: true },
    });
  }

  findById(id: number) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { facility: true },
    });
  }

  update(id: number, updateActivityDto: UpdateActivityDto) {
    return this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
      include: { facility: true },
    });
  }

  delete(id: number) {
    return this.prisma.activity.delete({ where: { id } });
  }
}
