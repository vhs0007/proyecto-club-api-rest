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

        await this.prisma.facility_workers.createMany({
            data: facilityId.map((fid) => ({ id, clubId, facilityId: fid, userId, userTypeId })),
        });

        const facility = await this.prisma.facilities.findMany({
            where: { id: { in: facilityId }, clubId },
            include: FACILITY_INCLUDE,
        });
        if (facility.length !== facilityId.length) {
            throw new NotFoundException(`Facility ${facilityId.filter(id => !facility.some(f => f.id === id))} not found in club ${clubId}`);
        }

        return {
            id,
            clubId,
            facilityNavigation: facility.map(f => this.mapFacilityNavigation(f)),
            userNavigation: this.mapUserNavigation(user),
        };
    }

    async update(id: number, updateFacilityWorkerDto: UpdateFacilityWorkerDto): Promise<FacilityWorkerResponseDto> {
        const existing = await this.prisma.facility_workers.findFirst({ where: { id, clubId: updateFacilityWorkerDto.clubId } });
        if (!existing){
            const createFacilityWorkerDto: CreateFacilityWorkerDto = {
                clubId: updateFacilityWorkerDto.clubId ?? 0,
                facilityId: updateFacilityWorkerDto.facilityId ?? [],
                userId: updateFacilityWorkerDto.userId ?? 0,
                userTypeId: updateFacilityWorkerDto.userTypeId ?? 0,
            };
            const created = await this.create(createFacilityWorkerDto);
            return created;
        }

        const effectiveUserTypeId = updateFacilityWorkerDto.userTypeId ?? existing.userTypeId;
        if (effectiveUserTypeId !== 1) {
            throw new BadRequestException('userTypeId debe ser 1 (solo trabajadores)');
        }

        const facilityIds = updateFacilityWorkerDto.facilityId ?? [existing.facilityId];
        const userId = updateFacilityWorkerDto.userId ?? existing.userId;
        const clubId = updateFacilityWorkerDto.clubId ?? existing.clubId;
        const userTypeId = effectiveUserTypeId;

        for (const fid of facilityIds) {
            const link = await this.prisma.facility_workers.findUnique({
                where: {
                    id_facilityId_userId_clubId_userTypeId: {
                        id: existing.id,
                        facilityId: fid,
                        userId: existing.userId,
                        clubId: existing.clubId,
                        userTypeId: existing.userTypeId,
                    },
                },
            });

            if (link) {
                await this.prisma.facility_workers.update({
                    where: {
                        id_facilityId_userId_clubId_userTypeId: {
                            id: existing.id,
                            facilityId: fid,
                            userId: existing.userId,
                            clubId: existing.clubId,
                            userTypeId: existing.userTypeId,
                        },
                    },
                    data: {
                        ...(updateFacilityWorkerDto.clubId !== undefined && { clubId: updateFacilityWorkerDto.clubId }),
                        ...(updateFacilityWorkerDto.userId !== undefined && { userId: updateFacilityWorkerDto.userId }),
                        ...(updateFacilityWorkerDto.userTypeId !== undefined && { userTypeId: updateFacilityWorkerDto.userTypeId }),
                    },
                });
            } else {
                await this.prisma.facility_workers.create({
                    data: { id: existing.id, clubId, facilityId: fid, userId, userTypeId },
                });
            }
        }

        const user = await this.prisma.users.findUnique({
            where: {
                id_clubId_typeId: {
                    id: userId,
                    clubId,
                    typeId: userTypeId,
                },
            },
        });
        if (!user) {
            throw new NotFoundException(`User ${userId} not found after update`);
        }

        const facility = await this.prisma.facilities.findMany({
            where: { id: { in: facilityIds }, clubId },
            include: FACILITY_INCLUDE,
        });
        if (facility.length !== facilityIds.length) {
            throw new NotFoundException(
                `Facility ${facilityIds.filter((facilityId) => !facility.some((f) => f.id === facilityId))} not found after update`,
            );
        }

        return {
            id: existing.id,
            clubId,
            facilityNavigation: facility.map((f) => this.mapFacilityNavigation(f)),
            userNavigation: this.mapUserNavigation(user),
        };
    }
}
