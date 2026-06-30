import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsIn,
  Min,
  IsDate,
  Matches,
} from 'class-validator';

export const ACTIVITY_STATES = [
  'PENDIENTE',
  'CONFIRMADO',
  'CANCELADO',
  'COMPLETADO',
  'SEÑADA',
] as const;

export class CreateActivityDto {
  @ApiProperty({
    example: 'Partido de fútbol',
    description: 'Nombre de la actividad',
  })
  @IsString({ message: 'name debe ser un texto' })
  name: string;

  @ApiProperty({ example: 'deporte', description: 'Tipo de actividad' })
  @IsString({ message: 'type debe ser un texto' })
  type: string;

  @ApiProperty({ example: '12:00', description: 'Hora de fin (HH:mm, 24h)' })
  @IsString({ message: 'hourEnd debe ser un texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hourEnd debe tener formato HH:mm',
  })
  hourEnd: string;

  @ApiProperty({ example: '10:00', description: 'Hora de inicio (HH:mm, 24h)' })
  @IsString({ message: 'hourStart debe ser un texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'hourStart debe tener formato HH:mm',
  })
  hourStart: string;

  @ApiProperty({
    example: 1,
    description:
      'Id del usuario que reserva la actividad (socio/miembro), no del instructor',
  })
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId: number;

  @ApiProperty({ example: 100, description: 'Costo' })
  @IsNumber({}, { message: 'cost debe ser un número' })
  @Min(0, { message: 'cost debe ser 0 o mayor' })
  cost: number;

  @ApiProperty({ example: 1, description: 'Id de la instalación' })
  @IsNumber({}, { message: 'facilityId debe ser un número' })
  @Min(1, { message: 'facilityId debe ser al menos 1' })
  facilityId: number;

  @ApiProperty({
    example: 'PENDIENTE',
    description: 'Estado de la actividad',
    required: false,
    enum: ACTIVITY_STATES,
  })
  @IsOptional()
  @IsString({ message: 'state debe ser un texto' })
  @IsIn(ACTIVITY_STATES, {
    message: 'state debe ser PENDIENTE, CONFIRMADO, CANCELADO, COMPLETADO o SEÑADA',
  })
  state?: string;

  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;

  @ApiProperty({ example: '2026-03-03', description: 'Fecha de la actividad' })
  @IsDate({ message: 'date debe ser una fecha válida' })
  date: Date;

  @ApiProperty({
    example: 1,
    description:
      'Tipo del usuario que reserva (clave compuesta con userId y clubId)',
  })
  @IsNumber({}, { message: 'userTypeId debe ser un número' })
  @Min(1, { message: 'userTypeId debe ser al menos 1' })
  userTypeId: number;
}
