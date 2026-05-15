import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateFacilityWorkerDto } from "../dto/request/create-facility_worker.dto";
import { UpdateFacilityWorkerDto } from "../dto/request/update-facility_worker.dto";
import { FacilityNavigation, IFacilityWorkersRepository, UserNavigation } from "./facility_workers.repository";
import { PrismaService } from "../../prisma/prisma.service";
import { FacilityWorkerResponseDto } from "../dto/response/facility_worker.response.dto";

interface UserRow {
    id: number;
    name: string;
    typeId: number;
    email: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
    document: string;
}

interface FacilityWorkerLinkRow {
    id: number;
    user: UserRow;
}

interface FacilityRow {
    id: number;
    type: string;
    capacity: number;
    isActive: boolean;
    ResponsibleWorkerUserId: number;
    user: UserRow | null;
    facility_workers: FacilityWorkerLinkRow[];
}

const FACILITY_INCLUDE = {
    user: true,
    facility_workers: { include: { user: true } },
} as const;

@Injectable()
export class FacilityWorkersRepository implements IFacilityWorkersRepository {
    constructor(private readonly prisma: PrismaService) {}

    private mapUserNavigation(user: UserRow): UserNavigation {
        return {
            id: user.id,
            name: user.name,
            typeId: user.typeId,
            email: user.email,
            createdAt: user.createdAt,
            deletedAt: user.deletedAt,
            isActive: user.isActive,
            document: user.document,
        };
    }

    private mapFacilityNavigation(facility: FacilityRow): FacilityNavigation {
        const assistants = facility.facility_workers
            .filter((fw) => fw.user.id !== facility.ResponsibleWorkerUserId)
            .map((fw) => this.mapUserNavigation(fw.user));

        return {
            id: facility.id,
            type: facility.type,
            capacity: facility.capacity,
            isActive: facility.isActive,
            responsibleWorker: facility.user ? this.mapUserNavigation(facility.user) : null,
            assistantWorkers: assistants.length > 0 ? assistants : null,
        };
    }

    private async generateNumerator(clubId: number): Promise<number> {
        const existNumerator = await this.prisma.numerator.findFirst({ where: { name: 'facility_workersId', clubId } });
        if (existNumerator) {
            return existNumerator.value + 1;
        }
        const numerator = await this.prisma.numerator.create({
            data: { name: 'facility_workersId', clubId, value: 1 },
        });
        return numerator.value;
    }

    async create(createFacilityWorkerDto: CreateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
        const { clubId, facilityId, userId, userTypeId } = createFacilityWorkerDto;

        if (userTypeId !== 1) {
            throw new BadRequestException('userTypeId debe ser 1 (solo trabajadores)');
        }

        const user = await this.prisma.users.findUnique({
            where: { id_clubId_typeId: { id: userId, clubId, typeId: userTypeId } },
        });
        if (!user) {
            throw new NotFoundException(`User ${userId} (type ${userTypeId}) not found in club ${clubId}`);
        }

        const id = await this.generateNumerator(clubId);

        const facilityWorker = await this.prisma.facility_workers.create({
            data: { id, clubId, facilityId, userId, userTypeId },
        });

        const facility = await this.prisma.facilities.findUnique({
            where: { id_clubId: { id: facilityId, clubId } },
            include: FACILITY_INCLUDE,
        });
        if (!facility) {
            throw new NotFoundException(`Facility ${facilityId} not found in club ${clubId}`);
        }

        return {
            id: id,
            clubId: facilityWorker.clubId,
            facilityNavigation: this.mapFacilityNavigation(facility),
            userNavigation: this.mapUserNavigation(user),
        };
    }

    async update(id: number, updateFacilityWorkerDto: UpdateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
        const existing = await this.prisma.facility_workers.findFirst({ where: { id, clubId: updateFacilityWorkerDto.clubId } });
        if (!existing) throw new NotFoundException(`Facility worker ${id} not found`);

        const effectiveUserTypeId = updateFacilityWorkerDto.userTypeId ?? existing.userTypeId;
        if (effectiveUserTypeId !== 1) {
            throw new BadRequestException('userTypeId debe ser 1 (solo trabajadores)');
        }

        const facilityWorker = await this.prisma.facility_workers.update({
            where: {
                id_facilityId_userId_clubId_userTypeId: {
                    id: existing.id,
                    facilityId: existing.facilityId,
                    userId: existing.userId,
                    clubId: existing.clubId,
                    userTypeId: existing.userTypeId,
                },
            },
            data: {
                ...(updateFacilityWorkerDto.clubId !== undefined && { clubId: updateFacilityWorkerDto.clubId }),
                ...(updateFacilityWorkerDto.facilityId !== undefined && { facilityId: updateFacilityWorkerDto.facilityId }),
                ...(updateFacilityWorkerDto.userId !== undefined && { userId: updateFacilityWorkerDto.userId }),
                ...(updateFacilityWorkerDto.userTypeId !== undefined && { userTypeId: updateFacilityWorkerDto.userTypeId }),
            },
        });

        const user = await this.prisma.users.findUnique({
            where: {
                id_clubId_typeId: {
                    id: facilityWorker.userId,
                    clubId: facilityWorker.clubId,
                    typeId: facilityWorker.userTypeId,
                },
            },
        });
        if (!user) {
            throw new NotFoundException(`User ${facilityWorker.userId} not found after update`);
        }

        const facility = await this.prisma.facilities.findUnique({
            where: { id_clubId: { id: facilityWorker.facilityId, clubId: facilityWorker.clubId } },
            include: FACILITY_INCLUDE,
        });
        if (!facility) {
            throw new NotFoundException(`Facility ${facilityWorker.facilityId} not found after update`);
        }

        return {
            id: facilityWorker.id,
            clubId: facilityWorker.clubId,
            facilityNavigation: this.mapFacilityNavigation(facility),
            userNavigation: this.mapUserNavigation(user),
        };
    }
}
