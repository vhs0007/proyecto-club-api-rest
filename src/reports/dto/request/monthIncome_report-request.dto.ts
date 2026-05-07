import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, Min } from 'class-validator';

export class MonthIncomeReportRequestDto {
  @ApiProperty({ example: 1, description: 'ID del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;

  @ApiProperty({
    example: '2026-03-15',
    description: 'Fecha base para extraer el mes del reporte',
  })
  @IsDateString(
    {},
    { message: 'date debe ser una fecha válida en formato ISO' },
  )
  date: string;
}
