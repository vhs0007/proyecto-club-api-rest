import { ApiProperty } from '@nestjs/swagger';
import type { UserNavigation, FacilityNavigation } from '../../repository/activitities.repository';

const userNavExample: UserNavigation = {
  id: 1,
  name: 'Juan Perez',
  typeId: 1,
  email: 'juan@example.com',
  createdAt: new Date('2026-01-01'),
  deletedAt: null,
  isActive: true,
  document: '12345678',
};

const facilityExample: FacilityNavigation = {
  id: 1,
  type: 'Gimnasio',
  capacity: 50,
  responsibleWorker: userNavExample,
  assistantWorkers: [userNavExample],
  isActive: true,
};

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

  @ApiProperty({
    example: userNavExample,
    nullable: true,
    description:
      'Usuario que realizó la reservación (no el instructor; instructores van en facility.responsibleWorker y facility.assistantWorkers)',
  })
  user: UserNavigation | null;

  @ApiProperty({ example: 100, description: 'Costo de la actividad' })
  cost: number;

  @ApiProperty({
    example: facilityExample,
    description:
      'Instalación anidada: responsibleWorker y assistantWorkers (null si no hay asistentes), alineado con el módulo facilities',
  })
  facility: FacilityNavigation;

  @ApiProperty({ example: true, description: '¿Está activa la actividad?' })
  isActive: boolean;

  @ApiProperty({ example: 1, description: 'ID del club' })
  clubId: number;
}
