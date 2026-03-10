import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityDto {
  @ApiProperty({ example: 'Partido de fútbol', description: 'Nombre de la actividad' })
  name: string;

  @ApiProperty({ example: 'deporte', description: 'Tipo de actividad' })
  type: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z', description: 'Fecha y hora de inicio' })
  startAt: Date;

  @ApiProperty({ example: '2026-03-03T12:00:00.000Z', description: 'Fecha y hora de fin' })
  endAt: Date;

  @ApiProperty({ example: 1, description: 'Id del usuario' })
  userId: number;

  @ApiProperty({ example: 100, description: 'Costo' })
  cost: number;

  @ApiProperty({ example: 1, description: 'Id de la instalación' })
  facilityId: number;

  @ApiProperty({ example: true, description: 'Activa', required: false })
  isActive?: boolean;
}
