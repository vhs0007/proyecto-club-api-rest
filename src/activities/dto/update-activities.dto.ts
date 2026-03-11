import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsDateString, Min } from 'class-validator';

export class UpdateActivityDto {
  @ApiProperty({ example: 'Partido de fútbol', required: false })
  @IsOptional()
  @IsString({ message: 'name debe ser un texto' })
  name?: string;

  @ApiProperty({ example: 'deporte', required: false })
  @IsOptional()
  @IsString({ message: 'type debe ser un texto' })
  type?: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'startAt debe ser una fecha válida en formato ISO' })
  startAt?: Date;

  @ApiProperty({ example: '2026-03-03T12:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'endAt debe ser una fecha válida en formato ISO' })
  endAt?: Date;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId?: number;

  @ApiProperty({ example: 100, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'cost debe ser un número' })
  @Min(0, { message: 'cost debe ser 0 o mayor' })
  cost?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'facilityId debe ser un número' })
  @Min(1, { message: 'facilityId debe ser al menos 1' })
  facilityId?: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser true o false' })
  isActive?: boolean;
}
