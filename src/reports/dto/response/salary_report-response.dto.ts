import { UserResponseDto } from "src/users/dto/response/user.response.dto";

export class SalaryReportResponseDto {
  user: UserResponseDto;
  salary: number;
  hoursWorked: number;
  hoursToWorkPerMonth: number;
  extraHours: number;
  totalSalary: number;
}
