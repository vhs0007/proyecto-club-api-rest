import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.facility.create({ data });
  }

  findMany() {
    return this.prisma.facility.findMany();
  }

  findById(id: number) {
    return this.prisma.facility.findUnique({ where: { id } });
  }

  update(id: number, data: any) {
    return this.prisma.facility.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.facility.delete({ where: { id } });
  }
}

