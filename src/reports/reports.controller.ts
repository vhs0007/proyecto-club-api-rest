import {
  Controller,
  Get,
  Body,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SalaryReportRequestDto } from './dto/request/salary_report-request.dto';
import { SalaryReportResponseDto } from './dto/response/salary_report-response.dto';
import { ApiOperation, ApiBody } from '@nestjs/swagger';
import { NewUsersReportRequestDto } from './dto/request/newUsers_report-request';
import { NewUsersReportResponseDto } from './dto/response/newUsers_report-response';
import { MonthIncomeReportRequestDto } from './dto/request/monthIncome_report-request.dto';
import { MonthIncomeReportResponseDto } from './dto/response/monthIncome_report-respones.dto';
import { MonthlyProgressionIncomeReportRequestDto } from './dto/request/monthlyProgressionIncome_report-request.dto';
import { MonthlyProgressionIncomeReportResponseDto } from './dto/response/monthlyProgressionIncome_report-response.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('salaries')
  @ApiOperation({ summary: 'Obtener reporte de salarios' })
  async getSalariesReport(
    @Query() request: SalaryReportRequestDto,
  ): Promise<SalaryReportResponseDto> {
    try {
      return this.reportsService.getSalariesReport(request);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('monthIncome')
  @ApiOperation({ summary: 'Obtener reporte de ingresos mensuales' })
  async getMonthIncomeReport(
    @Query() request: MonthIncomeReportRequestDto,
  ): Promise<MonthIncomeReportResponseDto> {
    try {
      return this.reportsService.getMonthIncomeReport(request);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('newUsers')
  @ApiOperation({ summary: 'Obtener reporte de nuevos usuarios' })
  async getNewUsersReport(
    @Query() request: NewUsersReportRequestDto,
  ): Promise<NewUsersReportResponseDto> {
    try {
      return this.reportsService.getNewUsersReport(request);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Get('monthlyProgressionIncome')
  @ApiOperation({ summary: 'Obtener reporte de ingresos mensuales' })
  async getMonthlyProgressionIncomeReport(
    @Query() request: MonthlyProgressionIncomeReportRequestDto,
  ): Promise<MonthlyProgressionIncomeReportResponseDto> {
    try {
      return this.reportsService.getMonthlyProgressionIncomeReport(request);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
