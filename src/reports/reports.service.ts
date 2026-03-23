import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './repository/reports.repository.impl';
import { SalaryReportRequestDto } from './dto/request/salary_report-request.dto';
import { SalaryReportResponseDto } from './dto/response/salary_report-response.dto';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getSalariesReport(request: SalaryReportRequestDto): Promise<SalaryReportResponseDto> {
    return this.reportsRepository.getSalariesReport(request);
  }
}
