import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateTimeEntryDto {
  @ApiProperty({
    example: '2026-03-03T08:00:00.000Z',
    description: 'Fecha y hora de ingreso',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'clockIn debe ser una fecha válida en formato ISO' },
  )
  clockIn?: string;

  @ApiProperty({
    example: '2026-03-03T17:00:00.000Z',
    description: 'Fecha y hora de egreso',
    required: false,
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'clockOut debe ser una fecha válida en formato ISO' },
  )
  clockOut?: string | null;
}
