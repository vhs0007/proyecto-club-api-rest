import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import type {
    DatetimeScheduledActivityNavigation,
    MembershipTypeNavigation,
    WorkingDayNavigation,
} from "src/facilities/repository/facilities.repository";
import {
    FacilityNavigation,
    ScheduledActivityRepository,
    UserNavigation,
} from "./scheduled_activities.repository";
import { CreateScheduledActivityDto } from "../dto/request/create-scheduled_activity.dto";
import { ScheduledActivityResponseDto } from "../dto/response/scheduled_activity.response.dto";
import { UpdateScheduledActivityDto } from "../dto/request/update-scheduled_activity.dto";
import { QueryScheduledActivityDto } from "../dto/request/query-scheduled_activity.dto";

type UserRow = {
    id: number;
    name: string;
    typeId: number;
    email: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
    document: string;
};

type MembershipTypeFromPrisma = {
    id: number;
    name: string;
    price: Prisma.Decimal;
};

interface WorkingDayRow {
    id: number;
    dayOfWeek: string;
}

interface DatetimeScheduledActivityRow {
    hourStart: string;
    hourEnd: string;
    working_day: WorkingDayRow;
}

interface ScheduledActivityMembershipLinkRow {
    membership_type: MembershipTypeFromPrisma;
}

type FacilityRow = {
    id: number;
    type: string;
    capacity: number;
    isActive: boolean;
    ResponsibleWorkerUserId: number;
    user: UserRow | null;
    facility_workers: { user: UserRow }[];
};

type ScheduledActivityRow = {
    id: number;
    clubId: number;
    facilityId: number;
    userId: number;
    userTypeId: number;
    facility: FacilityRow;
    name: string;
    scheduled_activities_assistant_workers: { user: UserRow }[];
    scheduled_activities_membership_types: ScheduledActivityMembershipLinkRow[];
    datetime_scheduled_activities: DatetimeScheduledActivityRow[];
};

const SCHEDULED_ACTIVITY_INCLUDE = {
    facility: {
        include: {
            user: true,
            facility_workers: { include: { user: true } },
        },
    },
    scheduled_activities_assistant_workers: { include: { user: true } },
    scheduled_activities_membership_types: { include: { membership_type: true } },
    datetime_scheduled_activities: { include: { working_day: true } },
};

@Injectable()
export class ScheduledActivitiesRepositoryImpl implements ScheduledActivityRepository {
    constructor(private readonly prisma: PrismaService) {}

    private userToNav(user: UserRow): UserNavigation {
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

    private membershipTypeToNav(
        membershipType: MembershipTypeFromPrisma,
    ): MembershipTypeNavigation {
        return {
            id: membershipType.id,
            name: membershipType.name,
            price: Number(membershipType.price),
        };
    }

    private workingDayToNav(workingDay: WorkingDayRow): WorkingDayNavigation {
        return {
            id: workingDay.id,
            dayOfWeek: workingDay.dayOfWeek,
        };
    }

    private datetimeToNav(datetime: DatetimeScheduledActivityRow): DatetimeScheduledActivityNavigation {
        return {
            hourStart: datetime.hourStart,
            hourEnd: datetime.hourEnd,
            workingDay: this.workingDayToNav(datetime.working_day),
        };
    }

    private mapFacility(facility: FacilityRow): FacilityNavigation {
        const assistants = facility.facility_workers
            .filter((fw) => fw.user.id !== facility.ResponsibleWorkerUserId)
            .map((fw) => this.userToNav(fw.user));

        return {
            id: facility.id,
            type: facility.type,
            capacity: facility.capacity,
            isActive: facility.isActive,
            responsibleWorker: facility.user ? this.userToNav(facility.user) : null,
            assistantWorkers: assistants.length > 0 ? assistants : null,
        };
    }

    private async mapRow(row: ScheduledActivityRow): Promise<ScheduledActivityResponseDto> {
        const responsibleUser = await this.prisma.users.findFirst({
            where: {
                id: row.userId,
                clubId: row.clubId,
                typeId: row.userTypeId,
            },
        });

        if (!responsibleUser) {
            throw new Error('Trabajador responsable no encontrado para la actividad rutinaria');
        }

        return {
            id: row.id,
            name: row.name,
            clubId: row.clubId,
            facility: this.mapFacility(row.facility),
            userId: row.userId,
            user: this.userToNav(responsibleUser),
            userTypeId: row.userTypeId,
            assistantWorkers: row.scheduled_activities_assistant_workers.map((worker) =>
                this.userToNav(worker.user),
            ),
            membershipTypes: row.scheduled_activities_membership_types.map((m) =>
                this.membershipTypeToNav(m.membership_type),
            ),
            datetimeScheduledActivities: row.datetime_scheduled_activities.map((d) =>
                this.datetimeToNav(d),
            ),
        };
    }

    private async findRowById(id: number, clubId: number): Promise<ScheduledActivityRow | null> {
        const row = await this.prisma.scheduled_activities.findUnique({
            where: { id_clubId: { id, clubId } },
            include: SCHEDULED_ACTIVITY_INCLUDE,
        });

        return row as ScheduledActivityRow | null;
    }

    async generateNumerator(clubId: number): Promise<number> {
        const existNumerator = await this.prisma.numerator.findFirst({
            where: { name: 'scheduledActivityId', clubId },
        });
        if (existNumerator) {
            const updated = await this.prisma.numerator.update({
                where: { id: existNumerator.id },
                data: { value: existNumerator.value + 1 },
            });
            return updated.value;
        }
        const numerator = await this.prisma.numerator.create({
            data: { name: 'scheduledActivityId', clubId, value: 1 },
        });
        return numerator.value;
    }

    async create(createScheduledActivityDto: CreateScheduledActivityDto): Promise<ScheduledActivityResponseDto> {
        const numerator : number = await this.generateNumerator(createScheduledActivityDto.clubId);
        const id : number = numerator;

        const created = await this.prisma.scheduled_activities.create({
            data: {
                id,
                clubId: createScheduledActivityDto.clubId,
                facilityId: createScheduledActivityDto.facilityId,
                userId: createScheduledActivityDto.userId,
                userTypeId: createScheduledActivityDto.userTypeId,
                name: createScheduledActivityDto.name,
            }
        });
        if(!created) {
            throw new Error('Error al crear la actividad rutinaria');
        }

        const childWhere = {
            scheduledActivityId: created.id,
            clubId: createScheduledActivityDto.clubId,
        };

        const assistantWorkers = await this.prisma.scheduled_activities_assistant_workers.createMany({
            data: createScheduledActivityDto.assistantWorkerIds.map((assistantWorkerId) => ({
                clubId: createScheduledActivityDto.clubId,
                scheduledActivityId: created.id,
                userId: assistantWorkerId,
                userTypeId: createScheduledActivityDto.userTypeId,
            })),
        });

        if(!assistantWorkers) {
            await this.prisma.scheduled_activities.delete({
                where: { id_clubId: { id: created.id, clubId: createScheduledActivityDto.clubId } },
            });
            throw new Error('Error al crear los trabajadores asistentes de la actividad rutinaria');
        }
        const membershipTypes = await this.prisma.scheduled_activities_membership_types.createMany({
            data: createScheduledActivityDto.membershipTypesIds.map((membershipTypeId) => ({
                clubId: createScheduledActivityDto.clubId,
                scheduledActivityId: created.id,
                membershipTypeId: membershipTypeId,
            })),
        });
        if(!membershipTypes) {
            await this.prisma.scheduled_activities.delete({
                where: { id_clubId: { id: created.id, clubId: createScheduledActivityDto.clubId } },
            });
            await this.prisma.scheduled_activities_assistant_workers.deleteMany({
                where: childWhere,
            });
            throw new Error('Error al crear los tipos de membresía de la actividad rutinaria');
        }
        const datetimeScheduledActivities = await this.prisma.datetime_scheduled_activities.createMany({
            data: createScheduledActivityDto.datetimeScheduledActivities.map((datetimeScheduledActivity) => ({
                clubId: createScheduledActivityDto.clubId,
                scheduledActivityId: created.id,
                hourStart: datetimeScheduledActivity.hourStart,
                hourEnd: datetimeScheduledActivity.hourEnd,
                workingDayId: datetimeScheduledActivity.workingDayId,
            })),
        });
        if(!datetimeScheduledActivities) {
            await this.prisma.scheduled_activities.delete({
                where: { id_clubId: { id: created.id, clubId: createScheduledActivityDto.clubId } },
            });
            await this.prisma.scheduled_activities_assistant_workers.deleteMany({
                where: childWhere,
            });
            await this.prisma.scheduled_activities_membership_types.deleteMany({
                where: childWhere,
            });
            throw new Error('Error al crear los horarios de la actividad rutinaria');
        }

        const refreshed = await this.findRowById(created.id, created.clubId);
        if (!refreshed) {
            throw new Error('Error al consultar la actividad rutinaria creada');
        }
        return this.mapRow(refreshed);
    }

    async findAll(clubId: number): Promise<ScheduledActivityResponseDto[]> {
        const rows = await this.prisma.scheduled_activities.findMany({
            where: { clubId },
            include: SCHEDULED_ACTIVITY_INCLUDE,
        });

        return Promise.all(
            rows.map((row) => this.mapRow(row as ScheduledActivityRow)),
        );
    }

    async findById(query: QueryScheduledActivityDto): Promise<ScheduledActivityResponseDto> {
        const row = await this.findRowById(query.id, query.clubId);
        if (!row) {
            throw new Error(`Actividad rutinaria ${query.id} no encontrada en el club ${query.clubId}`);
        }
        return this.mapRow(row);
    }

    async update(
        query: QueryScheduledActivityDto,
        updateScheduledActivityDto: UpdateScheduledActivityDto,
    ): Promise<ScheduledActivityResponseDto> {
        const existing = await this.prisma.scheduled_activities.findUnique({
            where: { id_clubId: { id: query.id, clubId: query.clubId } },
        });

        if (!existing) {
            throw new Error(`Actividad rutinaria ${query.id} no encontrada en el club ${query.clubId}`);
        }
        const childWhere = { scheduledActivityId: existing.id, clubId: query.clubId };
        const userTypeId = updateScheduledActivityDto.userTypeId ?? existing.userTypeId;

        const data: {
            facilityId?: number;
            userId?: number;
            userTypeId?: number;
            name?: string;
        } = {};

        if (updateScheduledActivityDto.facilityId !== undefined) {
            data.facilityId = updateScheduledActivityDto.facilityId;
        }
        if (updateScheduledActivityDto.userId !== undefined) {
            data.userId = updateScheduledActivityDto.userId;
        }
        if (updateScheduledActivityDto.userTypeId !== undefined) {
            data.userTypeId = updateScheduledActivityDto.userTypeId;
        }
        if (updateScheduledActivityDto.name !== undefined) {
            data.name = updateScheduledActivityDto.name;
        }

        if (Object.keys(data).length > 0) {
            await this.prisma.scheduled_activities.update({
                where: { id_clubId: { id: existing.id, clubId: query.clubId } },
                data,
            });
        }

        if (updateScheduledActivityDto.assistantWorkerIds !== undefined) {
            await this.prisma.scheduled_activities_assistant_workers.deleteMany({
                where: childWhere,
            });

            if (updateScheduledActivityDto.assistantWorkerIds.length > 0) {
                await this.prisma.scheduled_activities_assistant_workers.createMany({
                    data: updateScheduledActivityDto.assistantWorkerIds.map((assistantWorkerId) => ({
                        clubId: query.clubId,
                        scheduledActivityId: existing.id,
                        userId: assistantWorkerId,
                        userTypeId,
                    })),
                });
            }
        }

        if (updateScheduledActivityDto.membershipTypesIds !== undefined) {
            await this.prisma.scheduled_activities_membership_types.deleteMany({
                where: childWhere,
            });

            if (updateScheduledActivityDto.membershipTypesIds.length > 0) {
                await this.prisma.scheduled_activities_membership_types.createMany({
                    data: updateScheduledActivityDto.membershipTypesIds.map((membershipTypeId) => ({
                        clubId: query.clubId,
                        scheduledActivityId: existing.id,
                        membershipTypeId,
                    })),
                });
            }
        }

        if (updateScheduledActivityDto.datetimeScheduledActivities !== undefined) {
            await this.prisma.datetime_scheduled_activities.deleteMany({
                where: childWhere,
            });

            if (updateScheduledActivityDto.datetimeScheduledActivities.length > 0) {
                await this.prisma.datetime_scheduled_activities.createMany({
                    data: updateScheduledActivityDto.datetimeScheduledActivities.map((datetime) => ({
                        clubId: query.clubId,
                        scheduledActivityId: existing.id,
                        hourStart: datetime.hourStart,
                        hourEnd: datetime.hourEnd,
                        workingDayId: datetime.workingDayId,
                    })),
                });
            }
        }

        const updated = await this.findRowById(existing.id, query.clubId);
        if (!updated) {
            throw new Error(`Actividad rutinaria ${query.id} no encontrada después de actualizar`);
        }

        return this.mapRow(updated);
    }

    async delete(query: QueryScheduledActivityDto): Promise<void> {
        const existing = await this.prisma.scheduled_activities.findUnique({
            where: { id_clubId: { id: query.id, clubId: query.clubId } },
        });

        if (!existing) {
            throw new Error(`Actividad rutinaria ${query.id} no encontrada en el club ${query.clubId}`);
        }

        const childWhere = {
            scheduledActivityId: existing.id,
            clubId: query.clubId,
        };

        await this.prisma.datetime_scheduled_activities.deleteMany({
            where: childWhere,
        });
        await this.prisma.scheduled_activities_membership_types.deleteMany({
            where: childWhere,
        });
        await this.prisma.scheduled_activities_assistant_workers.deleteMany({
            where: childWhere,
        });
        await this.prisma.scheduled_activities_members.deleteMany({
            where: childWhere,
        });
        await this.prisma.scheduled_activities.delete({
            where: { id_clubId: { id: existing.id, clubId: query.clubId } },
        });
    }
}
