import { SalaryReportRequestDto } from "../dto/request/salary_report-request.dto";
import { SalaryReportResponseDto } from "../dto/response/salary_report-response.dto";
import { NewUsersReportRequestDto } from "../dto/request/newUsers_report-request";
import { NewUsersReportResponseDto } from "../dto/response/newUsers_report-response";
import { MonthIncomeReportRequestDto } from "../dto/request/monthIncome_report-request.dto";
import { MonthIncomeReportResponseDto } from "../dto/response/monthIncome_report-respones.dto";
import { MonthlyProgressionIncomeReportRequestDto } from "../dto/request/monthlyProgressionIncome_report-request.dto";
import { MonthlyProgressionIncomeReportResponseDto } from "../dto/response/monthlyProgressionIncome_report-response.dto";

export interface IReportsRepository {
  getSalariesReport(request: SalaryReportRequestDto): Promise<SalaryReportResponseDto>;
  getNewUsersReport(request: NewUsersReportRequestDto): Promise<NewUsersReportResponseDto>;
  getMonthIncomeReport(request: MonthIncomeReportRequestDto): Promise<MonthIncomeReportResponseDto>;
  getMonthlyProgressionIncomeReport(request: MonthlyProgressionIncomeReportRequestDto): Promise<MonthlyProgressionIncomeReportResponseDto>;
}