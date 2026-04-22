import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ITimeEntryRepository, userTypeNavigation, userNavigation } from "./time-entry.repository";
import { CreateTimeEntryDto } from "../dto/request/create-time-entry.dto";
import { UpdateTimeEntryDto } from "../dto/request/update-time-entry.dto";
import { TimeEntryResponseDto } from "../dto/response/time-entry.response.dto";


@Injectable()
export class TimeEntryRepository implements ITimeEntryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToUserNavigation(row: {
    id: number;
    name: string;
    email: string | null;
    createdAt: Date;
    isActive: boolean;
    type: userTypeNavigation;
  }): userNavigation {
    return { id: row.id, name: row.name, email: row.email ?? '', createdAt: row.createdAt, isActive: row.isActive, type: row.type };
  }

  private mapToTimeEntryResponse(row: {
    id: number;
    clubId: number;
    userId: number;
    userDocument: string;
    clockIn: Date;
    clockOut?: Date | null;
    user: userNavigation;
  }): TimeEntryResponseDto {
    return { id: row.id, clubId: row.clubId, user: this.mapToUserNavigation(row.user), userDocument: row.userDocument, clockIn: row.clockIn, clockOut: row.clockOut };
  }

  async findAll(clubId: number): Promise<TimeEntryResponseDto[]> {
    const list = await this.prisma.time_entries.findMany({ where: { clubId }, include: { user: { include: { type: true } } } });
    return list.map((row) => this.mapToTimeEntryResponse(row));
  }
  
  async findOne(id: number): Promise<TimeEntryResponseDto> {
    const row = await this.prisma.time_entries.findUnique({ where: { id }, include: { user: { include: { type: true } } } });
    if (!row) throw new NotFoundException('Time entry not found');
    return this.mapToTimeEntryResponse(row);
  } 

  async create(timeEntry: CreateTimeEntryDto): Promise<TimeEntryResponseDto> {
    const clockIn = new Date();
    const created = await this.prisma.time_entries.create({
      data: {
        clubId: timeEntry.clubId,
        userId: timeEntry.userId,
        userDocument: timeEntry.userDocument,
        clockIn: clockIn,
      },
      include: { user: { include: { type: true } } }
    })
  return this.mapToTimeEntryResponse(created);
  }

  async update(id: number, timeEntry: UpdateTimeEntryDto): Promise<TimeEntryResponseDto> {
    const data: { clockOut?: Date | null } = {};
    if (timeEntry.clockOut != null) {
      data.clockOut = new Date(timeEntry.clockOut);
    }
    const updated = await this.prisma.time_entries.update({ where: { id }, data, include: { user: { include: { type: true } } } });
    return this.mapToTimeEntryResponse(updated);
  }
}