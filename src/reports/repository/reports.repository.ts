import { SalaryReportRequestDto } from "../dto/request/salary_report-request.dto";
import { SalaryReportResponseDto } from "../dto/response/salary_report-response.dto";

export interface IReportsRepository {
  getSalariesReport(request: SalaryReportRequestDto): Promise<SalaryReportResponseDto>;
}