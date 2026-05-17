import { ApiProperty } from '@nestjs/swagger';
import type {
  ActivitiesNavigation,
  MembershipTypeNavigation,
  UserNavigation,
} from '../../repository/facilities.repository';

const userNavExample = {
  id: 1,
  name: 'Juan Perez',
  type: { id: 1, name: 'Entrenador' },
  email: 'juan.perez@example.com',
  createdAt: '2026-01-01',
  deletedAt: null,
  isActive: true,
};

export class FacilityResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la instalación' })
  id: number;
  @ApiProperty({ example: 'Gimnasio', description: 'Tipo de instalación' })
  type: string;
  @ApiProperty({ example: 100, description: 'Capacidad de la instalación' })
  capacity: number;
  @ApiProperty({
    example: userNavExample,
    nullable: true,
    description: 'Trabajador responsable',
  })
  responsibleWorker: UserNavigation | null;
  @ApiProperty({
    example: [userNavExample],
    nullable: true,
    description:
      'Trabajadores asistentes (excluye al responsable); null si no hay ninguno',
  })
  assistantWorkers: UserNavigation[] | null;
  @ApiProperty({ example: true, description: 'Estado de la instalación' })
  isActive: boolean;
  @ApiProperty({
    example: [
      {
        id: 1,
        name: 'Actividad 1',
        type: 'Tipo 1',
        date: '2026-01-01',
        hourStart: '09:00',
        hourEnd: '10:00',
        user: userNavExample,
        cost: 100,
        isActive: true,
      },
    ],
    description: 'Actividades',
  })
  activities: ActivitiesNavigation[];
  @ApiProperty({
    example: [{ id: 1, name: 'Membresía 1', price: 99.99 }],
    description: 'Membresías',
  })
  membershipTypes: MembershipTypeNavigation[];
}
