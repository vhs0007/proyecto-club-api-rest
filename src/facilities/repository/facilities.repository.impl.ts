import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { IFacilitiesRepository, FacilityResponse } from './facilities.repository';
import { CreateFacilityDto } from '../dto/request/create-facility.dto';
import { UpdateFacilityDto } from '../dto/request/update-facility.dto';
import type { WorkerNavigation } from './facilities.repository';

type WorkerFromPrisma = {
  id: number;
  name: string;
  typeId: number;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
};

@Injectable()
export class FacilitiesRepository implements IFacilitiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  private workerPrismaToInterface(worker: WorkerFromPrisma): WorkerNavigation {
    return {
      id: worker.id,
      name: worker.name,
      typeId: worker.typeId,
      email: worker.email,
      password: worker.password,
      createdAt: worker.createdAt,
      deletedAt: worker.deletedAt,
      isActive: worker.isActive,
    };
  }

  private stubWorker(id: number): WorkerNavigation {
    return {
      id,
      name: '',
      typeId: 0,
      email: null,
      password: null,
      createdAt: new Date(0),
      deletedAt: null,
      isActive: true,
    };
  }

  async create(createFacilityDto: CreateFacilityDto): Promise<FacilityResponse> {
    const { membershipTypeIds, id: _id, ...rest } = createFacilityDto;
    const data = {
      ...rest,
      isActive: createFacilityDto.isActive ?? true,
    };
    const created = await this.prisma.facilities.create({ data });
    if (membershipTypeIds.length > 0) {
      await this.prisma.facilities_membership.createMany({
        data: membershipTypeIds.map((membershipTypeId) => ({
          facilityId: created.id,
          membershipTypeId,
        })),
      });
    }
    const out = await this.findById(created.id);
    if (!out) throw new Error('Facility created but findById returned null');
    return out;
  }

  async findAll(): Promise<FacilityResponse[]> {
    const list = await this.prisma.facilities.findMany({
      include: { responsibleWorkerUser: true, assistantWorkerUser: true },
    });
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
      id: row.id,
      type: row.type,
      capacity: row.capacity,
      responsibleWorker: row.responsibleWorkerUser
        ? this.workerPrismaToInterface(row.responsibleWorkerUser)
        : this.stubWorker(row.responsibleWorker),
      assistantWorker:
        row.assistantWorkerUser && row.assistantWorker != null
          ? this.workerPrismaToInterface(row.assistantWorkerUser)
          : row.assistantWorker != null
            ? this.stubWorker(row.assistantWorker)
            : null,
      isActive: row.isActive,
      membershipTypeIds: membershipTypeIdsByFacilityId.get(row.id) ?? [],
    }));
  }

  async findById(id: number): Promise<FacilityResponse | null> {
    const facility = await this.prisma.facilities.findUnique({
      where: { id },
      include: { responsibleWorkerUser: true, assistantWorkerUser: true },
    });
    if (!facility) return null;
    const links = await this.prisma.facilities_membership.findMany({
      where: { facilityId: id },
    });
    return {
      id: facility.id,
      type: facility.type,
      capacity: facility.capacity,
      responsibleWorker: facility.responsibleWorkerUser
        ? this.workerPrismaToInterface(facility.responsibleWorkerUser)
        : this.stubWorker(facility.responsibleWorker),
      assistantWorker:
        facility.assistantWorkerUser && facility.assistantWorker != null
          ? this.workerPrismaToInterface(facility.assistantWorkerUser)
          : facility.assistantWorker != null
            ? this.stubWorker(facility.assistantWorker)
            : null,
      isActive: facility.isActive,
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
    await this.prisma.facilities.update({
      where: { id },
      data,
    });
    const out = await this.findById(id);
    if (!out) throw new Error('Facility updated but findById returned null');
    return out;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.facilities_membership.deleteMany({
      where: { facilityId: id },
    });
    await this.prisma.facilities.delete({ where: { id } });
  }
}
