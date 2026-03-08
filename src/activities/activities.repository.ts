import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.activity.create({
      data,
      include: { facility: true },
    });
  }

  findMany() {
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

  update(id: number, data: any) {
    return this.prisma.activity.update({
      where: { id },
      data,
      include: { facility: true },
    });
  }

  remove(id: number) {
    return this.prisma.activity.delete({ where: { id } });
  }
}
