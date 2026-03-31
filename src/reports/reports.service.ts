import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './repository/reports.repository.impl';
import { SalaryReportRequestDto } from './dto/request/salary_report-request.dto';
import { SalaryReportResponseDto } from './dto/response/salary_report-response.dto';
import { NewUsersReportRequestDto } from './dto/request/newUsers_report-request';
import { NewUsersReportResponseDto } from './dto/response/newUsers_report-response';
import { MonthIncomeReportRequestDto } from './dto/request/monthIncome_report-request.dto';
import { MonthIncomeReportResponseDto } from './dto/response/monthIncome_report-respones.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getSalariesReport(request: SalaryReportRequestDto): Promise<SalaryReportResponseDto> {
    return this.reportsRepository.getSalariesReport(request);
  }

  async getNewUsersReport(request: NewUsersReportRequestDto): Promise<NewUsersReportResponseDto> {
    return this.reportsRepository.getNewUsersReport(request);
  }

  async getMonthIncomeReport(request: MonthIncomeReportRequestDto): Promise<MonthIncomeReportResponseDto> {
    return this.reportsRepository.getMonthIncomeReport(request);
  }
}
