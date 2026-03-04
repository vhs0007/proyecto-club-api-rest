import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository } from './facilities.repository';
import { CreateFacilityDto } from '../dto/create-facility.dto';
import { UpdateFacilityDto } from '../dto/update-facility.dto';

@Injectable()
export class FacilitiesRepository implements IFacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(createFacilityDto: CreateFacilityDto) {
    return this.prisma.facility.create({ data: createFacilityDto });
  }

  findAll() {
    return this.prisma.facility.findMany();
  }

  findById(id: number) {
    return this.prisma.facility.findUnique({ where: { id } });
  }

  update(id: number, updateFacilityDto: UpdateFacilityDto) {
    return this.prisma.facility.update({
      where: { id },
      data: updateFacilityDto,
    });
  }

  delete(id: number) {
    return this.prisma.facility.delete({ where: { id } });
  }
}

