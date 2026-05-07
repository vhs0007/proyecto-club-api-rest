import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTimeEntryDto {
  @ApiProperty({ example: 1, description: 'Id del usuario' })
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;

  @ApiProperty({ example: '1234567890', description: 'Documento del usuario' })
  @IsString({ message: 'userDocument debe ser un texto' })
  userDocument: string;

  @ApiProperty({
    example: '2026-03-03T08:00:00.000Z',
    description: 'Fecha y hora de ingreso',
  })
  @IsDateString(
    {},
    { message: 'clockIn debe ser una fecha válida en formato ISO' },
  )
  clockIn: string;

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
