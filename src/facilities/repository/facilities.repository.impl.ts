import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, FacilityResponse } from './facilities.repository';
import { CreateFacilityDto } from '../dto/create-facility.dto';
import { UpdateFacilityDto } from '../dto/update-facility.dto';

@Injectable()
export class FacilitiesRepository implements IFacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse> {
    const { membershipTypeIds, ...data } = createFacilityDto;
    const created = await this.prisma.facilities.create({
      data: {
        ...data,
        assistantWorker: data.assistantWorker ?? null,
        isActive: data.isActive ?? true,
      },
    });
    if (membershipTypeIds.length > 0) {
      await this.prisma.facilities_membership.createMany({
        data: membershipTypeIds.map((membershipTypeId) => ({
          facilityId: created.id,
          membershipTypeId,
        })),
      });
    }
    return { ...created, membershipTypeIds };
  }

  async findAll(): Promise<FacilityResponse[]> {
    const list = await this.prisma.facilities.findMany();
    const ids = list.map((f) => f.id);
    const links =
      ids.length === 0
        ? []
        : await this.prisma.facilities_membership.findMany({
            where: { facilityId: { in: ids } },
          });
    const membershipTypeIdsByFacilityId = new Map<number, number[]>();
    for (const link of links) {
      const arr = membershipTypeIdsByFacilityId.get(link.facilityId) ?? [];
      arr.push(link.membershipTypeId);
      membershipTypeIdsByFacilityId.set(link.facilityId, arr);
    }
    return list.map((row) => ({
      ...row,
      membershipTypeIds: membershipTypeIdsByFacilityId.get(row.id) ?? [],
    }));
  }

  async findById(id: number): Promise<FacilityResponse | null> {
    const facility = await this.prisma.facilities.findUnique({
      where: { id },
    });
    if (!facility) return null;
    const links = await this.prisma.facilities_membership.findMany({
      where: { facilityId: id },
    });
    return {
      ...facility,
      membershipTypeIds: links.map((l) => l.membershipTypeId),
    };
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse> {
    const { membershipTypeIds, ...rest } = updateFacilityDto;
    const data: Record<string, unknown> = { ...rest };
    if (membershipTypeIds !== undefined) {
      await this.prisma.facilities_membership.deleteMany({
        where: { facilityId: id },
      });
      if (membershipTypeIds.length > 0) {
        await this.prisma.facilities_membership.createMany({
          data: membershipTypeIds.map((membershipTypeId) => ({ facilityId: id, membershipTypeId })),
        });
      }
    }
    const updated = await this.prisma.facilities.update({
      where: { id },
      data,
    });
    const links = await this.prisma.facilities_membership.findMany({
      where: { facilityId: id },
    });
    return {
      ...updated,
      membershipTypeIds: links.map((l) => l.membershipTypeId),
    };
  }

  async delete(id: number): Promise<void> {
    await this.prisma.facilities_membership.deleteMany({
      where: { facilityId: id },
    });
    await this.prisma.facilities.delete({ where: { id } });
  }
}
