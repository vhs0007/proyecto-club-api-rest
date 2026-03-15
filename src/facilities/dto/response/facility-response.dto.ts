import { ApiProperty } from '@nestjs/swagger';
import type { WorkerNavigation } from '../../repository/facilities.repository';
import type { ActivitiesNavigation } from '../../repository/facilities.repository';


export class FacilityResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la instalación' })
  id: number;
  @ApiProperty({ example: 'Gimnasio', description: 'Tipo de instalación' })
  type: string;
  @ApiProperty({ example: 100, description: 'Capacidad de la instalación' })
  capacity: number;
  @ApiProperty({ example: { id: 1, name: 'Juan Perez', typeId: 1, email: 'juan.perez@example.com', password: '123456', createdAt: '2026-01-01', deletedAt: null, isActive: true }, description: 'Trabajador responsable' })
  responsibleWorker: WorkerNavigation;
  @ApiProperty({ example: { id: 2, name: 'Maria Lopez', typeId: 1, email: 'maria.lopez@example.com', password: '123456', createdAt: '2026-01-01', deletedAt: null, isActive: true }, description: 'Trabajador asistente' })
  assistantWorker: WorkerNavigation | null;
  @ApiProperty({ example: true, description: 'Estado de la instalación' })
  isActive: boolean;
  @ApiProperty({ example: [{ id: 1, name: 'Actividad 1', type: 'Tipo 1', startAt: '2026-01-01', endAt: '2026-01-01', user: { id: 1, name: 'Juan Perez', typeId: 1, email: 'juan.perez@example.com', password: '123456', createdAt: '2026-01-01', deletedAt: null, isActive: true }, cost: 100, facility: { id: 1, name: 'Gimnasio', type: 'Tipo 1', capacity: 100, responsibleWorker: { id: 1, name: 'Juan Perez', typeId: 1, email: 'juan.perez@example.com', password: '123456', createdAt: '2026-01-01', deletedAt: null, isActive: true }, assistantWorker: null, isActive: true }, isActive: true }], description: 'Actividades' })
  activities: ActivitiesNavigation[];
}
