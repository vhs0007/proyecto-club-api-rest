import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, FacilityResponse } from './facilities.repository';
import { CreateFacilityDto } from '../dto/create-facility.dto';
import { UpdateFacilityDto } from '../dto/update-facility.dto';

@Injectable()
export class FacilitiesRepository implements IFacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse> {
    const { membershipIds, ...data } = createFacilityDto;
    const created = await (this.prisma as any).facilities.create({
      data: {
        ...data,
        assistantWorker: data.assistantWorker ?? null,
        isActive: data.isActive ?? true,
      },
    });
    if (membershipIds.length > 0) {
      await (this.prisma as any).facilities_membership.createMany({
        data: membershipIds.map((membershipId) => ({
          facilityId: created.id,
          membershipId,
        })),
      });
    }
    return { ...created, membershipIds };
  }

  async findAll(): Promise<FacilityResponse[]> {
    const list = await (this.prisma as any).facilities.findMany();
    const ids = list.map((f) => f.id);
    const links =
      ids.length === 0
        ? []
        : await (this.prisma as any).facilities_membership.findMany({
            where: { facilityId: { in: ids } },
          });
    const membershipIdsByFacilityId = new Map<number, number[]>();
    for (const link of links) {
      const arr = membershipIdsByFacilityId.get(link.facilityId) ?? [];
      arr.push(link.membershipId);
      membershipIdsByFacilityId.set(link.facilityId, arr);
    }
    return list.map((row) => ({
      ...row,
      membershipIds: membershipIdsByFacilityId.get(row.id) ?? [],
    }));
  }

  async findById(id: number): Promise<FacilityResponse | null> {
    const facility = await (this.prisma as any).facilities.findUnique({
      where: { id },
    });
    if (!facility) return null;
    const links = await (this.prisma as any).facilities_membership.findMany({
      where: { facilityId: id },
    });
    return {
      ...facility,
      membershipIds: links.map((l) => l.membershipId),
    };
  }

  async update(id: number, updateFacilityDto: UpdateFacilityDto): Promise<FacilityResponse> {
    const { membershipIds, ...rest } = updateFacilityDto;
    const data: Record<string, unknown> = { ...rest };
    if (membershipIds !== undefined) {
      await (this.prisma as any).facilities_membership.deleteMany({
        where: { facilityId: id },
      });
      if (membershipIds.length > 0) {
        await (this.prisma as any).facilities_membership.createMany({
          data: membershipIds.map((membershipId) => ({ facilityId: id, membershipId })),
        });
      }
    }
    const updated = await (this.prisma as any).facilities.update({
      where: { id },
      data,
    });
    const links = await (this.prisma as any).facilities_membership.findMany({
      where: { facilityId: id },
    });
    return {
      ...updated,
      membershipIds: links.map((l) => l.membershipId),
    };
  }

  async delete(id: number): Promise<void> {
    await (this.prisma as any).facilities_membership.deleteMany({
      where: { facilityId: id },
    });
    await (this.prisma as any).facilities.delete({ where: { id } });
  }
}
