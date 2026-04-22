import { ApiProperty } from '@nestjs/swagger';
import type { UserNavigation, FacilityNavigation } from '../../repository/activitities.repository';

export class ActivityResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la actividad' })
  id: number;

  @ApiProperty({ example: 'Activity 1', description: 'Nombre de la actividad' })
  name: string;

  @ApiProperty({ example: 'Type 1', description: 'Tipo de actividad' })
  type: string;

  @ApiProperty({ example: '10:00', description: 'Hora de inicio (HH:mm)' })
  hourStart: string;

  @ApiProperty({ example: '12:00', description: 'Hora de fin (HH:mm)' })
  hourEnd: string;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de la actividad' })
  date: Date;

  @ApiProperty({ example: 1, description: 'Usuario' })
  user: UserNavigation | null;

  @ApiProperty({ example: 100, description: 'Costo de la actividad' })
  cost: number;

  @ApiProperty({ example: 1, description: 'Instalación' })
  facility: FacilityNavigation;

  @ApiProperty({ example: true, description: '¿Está activa la actividad?' })
  isActive: boolean;

  @ApiProperty({ example: 1, description: 'ID del club' })
  clubId: number;
}