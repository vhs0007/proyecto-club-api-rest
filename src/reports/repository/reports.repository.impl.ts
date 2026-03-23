import { Injectable, NotFoundException } from "@nestjs/common";
import { IReportsRepository } from "./reports.repository";
import { SalaryReportRequestDto } from "../dto/request/salary_report-request.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SalaryReportResponseDto } from "../dto/response/salary_report-response.dto";
import { UserResponseDto } from "src/users/dto/response/user.response.dto";
import { Prisma } from "@prisma/client";


interface UserFromPrisma {
  id: number;
  name: string;
  typeId: number;
  type: TypeFromPrisma;
  email: string | null;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  salary: Prisma.Decimal | null;
  hoursToWorkPerDay: number | null;
  startWorkAt: Date | null;
  endWorkAt: Date | null;
  weight: Prisma.Decimal | null;
  height: Prisma.Decimal | null;
  gender: string | null;
  birthDate: Date | null;
  diet: string | null;
  allergies: string | null;
  medicalConditions: string | null;
  medicalHistory: string | null;
  medications: string | null;
  trainingPlan: string | null;
}

interface TypeFromPrisma {
  name: string;
  id: number;
}

@Injectable()
export class ReportsRepository implements IReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private userPrismaToInterface(user: UserFromPrisma): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      type: user.type,
      email: user.email,
      password: user.password,
      typeId: user.typeId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      salary: user.salary?.toNumber() ?? 0,
      hoursToWorkPerDay: user.hoursToWorkPerDay ?? 0,
      startWorkAt: user.startWorkAt ?? null,
      endWorkAt: user.endWorkAt ?? null,
      weight: user.weight?.toNumber() ?? 0,
      height: user.height?.toNumber() ?? 0,
      gender: user.gender ?? null,
      birthDate: user.birthDate ?? null,
      diet: user.diet ?? null,
      allergies: user.allergies ?? null,
      medicalConditions: user.medicalConditions ?? null,
      medicalHistory: user.medicalHistory ?? null,
      medications: user.medications ?? null,
      trainingPlan: user.trainingPlan ?? null,
    };
  }

  async getSalariesReport(request: SalaryReportRequestDto): Promise<SalaryReportResponseDto> {
    const user: UserFromPrisma | null = await this.prisma.users.findUnique({
      where: { id: request.userId },
      include: { type: true },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const userDto = this.userPrismaToInterface(user);
    userDto.type = user.type;
    return {
      user: userDto,
      salary: user.salary?.toNumber() ?? 0,
      hoursWorked: user.hoursToWorkPerDay ?? 0,
      hoursToWorkPerMonth: user.hoursToWorkPerDay ? user.hoursToWorkPerDay * 30 : 0,
      extraHours: 0,
      totalSalary: user.salary?.toNumber() ?? 0,
    };
  }
}