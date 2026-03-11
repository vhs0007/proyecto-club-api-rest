import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString({ message: 'name debe ser un texto' })
  name: string;

  @ApiProperty({ example: 3, description: '1=WORKER, 2=ATHLETE, 3=MEMBER' })
  @IsNumber({}, { message: 'typeId debe ser un número' })
  @Min(1, { message: 'typeId debe ser mayor 1' })
  typeId: number;

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
  @IsDateString({}, { message: 'createdAt debe ser una fecha válida en formato ISO' })
  createdAt?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'deletedAt debe ser una fecha válida en formato ISO' })
  deletedAt?: Date | null;

  @ApiProperty({ example: true })
  @IsBoolean({ message: 'isActive debe ser true o false' })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber({}, { message: 'roleId debe ser un número' })
  @Min(1, { message: 'roleId debe ser al menos 1' })
  roleId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'salary debe ser un número' })
  @Min(0, { message: 'salary debe ser 0 o mayor' })
  salary?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'hoursToWorkPerDay debe ser un número' })
  @Min(0, { message: 'hoursToWorkPerDay debe ser 0 o mayor' })
  hoursToWorkPerDay?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'startWorkAt debe ser una fecha válida en formato ISO' })
  startWorkAt?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'endWorkAt debe ser una fecha válida en formato ISO' })
  endWorkAt?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'weight debe ser un número' })
  @Min(0, { message: 'weight debe ser 0 o mayor' })
  weight?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'height debe ser un número' })
  @Min(0, { message: 'height debe ser 0 o mayor' })
  height?: number | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'gender debe ser un texto' })
  gender?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString({}, { message: 'birthDate debe ser una fecha válida en formato ISO' })
  birthDate?: Date | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'diet debe ser un texto' })
  diet?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'trainingPlan debe ser un texto' })
  trainingPlan?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medicalHistory debe ser un texto' })
  medicalHistory?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'allergies debe ser un texto' })
  allergies?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medications debe ser un texto' })
  medications?: string | null;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'medicalConditions debe ser un texto' })
  medicalConditions?: string | null;
}
