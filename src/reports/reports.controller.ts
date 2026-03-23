import { Controller, Get, Body, InternalServerErrorException, Query} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { SalaryReportRequestDto } from './dto/request/salary_report-request.dto';
import { SalaryReportResponseDto } from './dto/response/salary_report-response.dto';
import { ApiOperation, ApiBody } from '@nestjs/swagger';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('salaries')
  @ApiOperation({ summary: 'Obtener reporte de salarios' })
  async getSalariesReport(@Query() request: SalaryReportRequestDto): Promise<SalaryReportResponseDto> {
    try{
      return this.reportsService.getSalariesReport(request);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
