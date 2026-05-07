import { MonthIncomeReportResponseDto } from './monthIncome_report-respones.dto';

export interface MonthlyProgressionIncomeReportResponseDto {
  dateStart: Date;
  dateEnd: Date;
  totalIncome: number;
  totalIncomeMemberships: number;
  totalIncomeActivities: number;
  monthlyIncomes: MonthIncomeReportResponseDto[];
}
