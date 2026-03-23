import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber } from "class-validator";

export class SalaryReportRequestDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNumber({}, { message: 'userId debe ser un número' })
  userId: number;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de inicio' })
  @IsDateString({}, { message: 'startDate debe ser una fecha válida' })
  startDate: string;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de fin' })
  @IsDateString({}, { message: 'endDate debe ser una fecha válida' })
  endDate: string;
}