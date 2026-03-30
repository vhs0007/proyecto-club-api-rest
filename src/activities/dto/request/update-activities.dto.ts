import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, Min, Matches } from 'class-validator';

export class UpdateActivityDto {
  @ApiProperty({ example: 'Partido de fútbol', required: false })
  @IsOptional()
  @IsString({ message: 'name debe ser un texto' })
  name?: string;

  @ApiProperty({ example: 'deporte', required: false })
  @IsOptional()
  @IsString({ message: 'type debe ser un texto' })
  type?: string;

  @ApiProperty({ example: '10:00', required: false })
  @IsOptional()
  @IsString({ message: 'hourStart debe ser un texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'hourStart debe tener formato HH:mm' })
  hourStart?: string;

  @ApiProperty({ example: '12:00', required: false })
  @IsOptional()
  @IsString({ message: 'hourEnd debe ser un texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'hourEnd debe tener formato HH:mm' })
  hourEnd?: string;

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

  @ApiProperty({ example: '2026-03-03', description: 'Fecha de la actividad' })
  @IsOptional()
  @IsString({ message: 'date debe ser un texto' })
  date: string;
}
