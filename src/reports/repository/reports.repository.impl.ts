import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IReportsRepository } from "./reports.repository";
import { SalaryReportRequestDto } from "../dto/request/salary_report-request.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SalaryReportResponseDto } from "../dto/response/salary_report-response.dto";
import { UserResponseDto } from "src/users/dto/response/user.response.dto";
import { Prisma } from "@prisma/client";
import { NewUsersReportResponseDto } from "../dto/response/newUsers_report-response";
import { NewUsersReportRequestDto } from "../dto/request/newUsers_report-request";
import { MonthIncomeReportRequestDto } from "../dto/request/monthIncome_report-request.dto";
import { MonthIncomeReportResponseDto } from "../dto/response/monthIncome_report-respones.dto";
import { MonthlyProgressionIncomeReportRequestDto } from "../dto/request/monthlyProgressionIncome_report-request.dto";
import { MonthlyProgressionIncomeReportResponseDto } from "../dto/response/monthlyProgressionIncome_report-response.dto";


interface UserFromPrisma {
  id: number;
  name: string;
  typeId: number;
  type: TypeFromPrisma;
  email: string | null;
  document: string;
  password: string | null;
  createdAt: Date;
  deletedAt: Date | null;
  isActive: boolean;
  salary: Prisma.Decimal | null;
  hoursToWorkPerDay: number | null;
  employmentStartDate: Date | null;
  startWorkAt: string | null;
  endWorkAt: string | null;
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

interface MembershipFromPrisma {
  id: number;
  expiration: Date;
  type: {
    price: Prisma.Decimal;
  };
}

interface ActivityFromPrisma {
  id: number;
  cost: Prisma.Decimal;
  date: Date;
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
      document: user.document,
      password: user.password,
      typeId: user.typeId,
      isActive: user.isActive,
      createdAt: user.createdAt,
      deletedAt: user.deletedAt,
      salary: user.salary?.toNumber() ?? 0,
      hoursToWorkPerDay: user.hoursToWorkPerDay ?? 0,
      startWorkAt: user.startWorkAt ?? '',
      endWorkAt: user.endWorkAt ?? '',
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
      where: {
        id_clubId_typeId: {
          id: request.userId,
          clubId: request.clubId,
          typeId: request.typeId,
        },
      },
      include: { type: true },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const userDto = this.userPrismaToInterface(user);
    userDto.type = user.type;

    const hourlyCost = user.salary?.toNumber() ?? 0; //suponemos que salary es el costo hora viste
    const workHoursPerDay = user.hoursToWorkPerDay ?? 0;
    const workDaysPerMonth = 30;
    const hoursToWorkPerMonth = workHoursPerDay * workDaysPerMonth;
    const totalSalary = hourlyCost * hoursToWorkPerMonth;
    return {
      user: userDto,
      salary: user.salary?.toNumber() ?? 0,
      hoursWorked: user.hoursToWorkPerDay ?? 0,
      hoursToWorkPerMonth: user.hoursToWorkPerDay ? user.hoursToWorkPerDay * 30 : 0,
      extraHours: 0,
      totalSalary: totalSalary,
    };
  }

  async getNewUsersReport(request: NewUsersReportRequestDto): Promise<NewUsersReportResponseDto> {
    const requestedDate = new Date(request.date);
    const monthStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), 1);
    const nextMonthStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth() + 1, 1);

    const users: UserFromPrisma[] = await this.prisma.users.findMany({
      where: {
        clubId: request.clubId,
        typeId: request.typeId,
        createdAt: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      include: { type: true },
    });
    return {
      users: users.map(this.userPrismaToInterface),
      totalUsers: users.length,
    };
  }

  async getMonthIncomeReport(request: MonthIncomeReportRequestDto): Promise<MonthIncomeReportResponseDto> {
    const requestedDate = new Date(request.date);
    const monthStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth(), 1);
    const nextMonthStart = new Date(requestedDate.getFullYear(), requestedDate.getMonth() + 1, 1);

    const memberships: MembershipFromPrisma[] = await this.prisma.membership.findMany({
      where: {
        clubId: request.clubId,
        createdAt: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
      include: { type: { select: { price: true } } },
    });
    const activities: ActivityFromPrisma[] = await this.prisma.activity.findMany({
      where: {
        clubId: request.clubId,
        date: {
          gte: monthStart,
          lt: nextMonthStart,
        },
      },
    });
    const monthIncomeMemberships = memberships.reduce((acc, membership) => acc + membership.type.price.toNumber(), 0);
    const monthIncomeActivities = activities.reduce((acc, activity) => acc + activity.cost.toNumber(), 0);
    return {
      month: monthStart,
      monthIncomeTotal: monthIncomeMemberships + monthIncomeActivities,
      monthIncomeMemberships,
      monthIncomeActivities,
    };
  }

  async getMonthlyProgressionIncomeReport(request: MonthlyProgressionIncomeReportRequestDto): Promise<MonthlyProgressionIncomeReportResponseDto> {
    const start = new Date(request.dateStart);
    const end = new Date(request.dateEnd);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException("Las fechas ingresadas no son válidas");
    }

    const current = new Date(start.getFullYear(), start.getMonth(), 1);
    const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);

    if (current > endMonth) {
      throw new BadRequestException("dateStart no puede ser mayor a dateEnd");
    }

    const monthlyIncomes: MonthIncomeReportResponseDto[] = [];

    while (current <= endMonth) {
      const monthIncome = await this.getMonthIncomeReport({
        clubId: request.clubId,
        date: current.toISOString(),
      });

      monthlyIncomes.push(monthIncome);

      current.setMonth(current.getMonth() + 1);
    }

    const totalIncome = monthlyIncomes.reduce(
      (acc, month) => acc + month.monthIncomeTotal, 0
    );
    const totalIncomeMemberships = monthlyIncomes.reduce(
      (acc, month) => acc + month.monthIncomeMemberships, 0
    );
    const totalIncomeActivities = monthlyIncomes.reduce(
      (acc, month) => acc + month.monthIncomeActivities, 0
    );
    return {
      dateStart: start,
      dateEnd: end,
      totalIncome,
      totalIncomeMemberships,
      totalIncomeActivities,
      monthlyIncomes,
    };
  }


}