import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDate,
  IsDateString,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'name debe ser un texto' })
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'email debe ser un texto' })
  email?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'password debe ser un texto' })
  password?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'salary debe ser un número' })
  @Min(0, { message: 'salary debe ser 0 o mayor' })
  salary?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'hoursToWorkPerDay debe ser un número' })
  @Min(0, { message: 'hoursToWorkPerDay debe ser 0 o mayor' })
  hoursToWorkPerDay?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate({ message: 'startWorkAt debe ser una fecha válida' })
  startWorkAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate({ message: 'endWorkAt debe ser una fecha válida' })
  endWorkAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'weight debe ser un número' })
  @Min(0, { message: 'weight debe ser 0 o mayor' })
  weight?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'height debe ser un número' })
  @Min(0, { message: 'height debe ser 0 o mayor' })
  height?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'gender debe ser un texto' })
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate({ message: 'birthDate debe ser una fecha válida' })
  birthDate?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'createdAt debe ser una fecha válida en formato ISO' })
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'deletedAt debe ser una fecha válida en formato ISO' })
  deletedAt?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser true o false' })
  isActive?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'diet debe ser un texto' })
  diet?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'trainingPlan debe ser un texto' })
  trainingPlan?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medicalHistory debe ser un texto' })
  medicalHistory?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'allergies debe ser un texto' })
  allergies?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medications debe ser un texto' })
  medications?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medicalConditions debe ser un texto' })
  medicalConditions?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'typeId debe ser un número' })
  @Min(1, { message: 'typeId debe ser 1, 2 o 3' })
  typeId?: number;
}
