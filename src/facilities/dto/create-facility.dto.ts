import {ApiProperty} from '@nestjs/swagger';

export class CreateFacilityDto {
  @ApiProperty({ example: '1', description: 'Id de la instalacion' })
  id?: number;
  @ApiProperty({ example: 'Sala de musculacion', description: 'Tipo de instalacion' })
  type: string;
  @ApiProperty({ example: '10', description: 'Capacidad de la instalacion' })
  capacity: number;
  @ApiProperty({ example: '1', description: 'Id del trabajador responsable' })
  responsibleWorker: number;
  @ApiProperty({ example: '1', description: 'Id del trabajador asistente' })
  assistantWorker?: number | null;
  @ApiProperty({ example: true, description: 'Estado de la instalacion' })
  isActive?: boolean;
  @ApiProperty({ example: '[1, 2]', description: 'Ids de las membresias' })
  membershipIds: number[];
}

