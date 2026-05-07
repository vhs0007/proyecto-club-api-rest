import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  Min,
} from 'class-validator';

export class CreateFacilityDto {
  @ApiProperty({ example: '1', description: 'Id de la instalacion' })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({ example: 'Sala de musculacion', description: 'Tipo de instalacion' })
  @IsString()
  type: string;

  @ApiProperty({ example: '10', description: 'Capacidad de la instalacion' })
  @IsNumber()
  @Min(4, { message: 'La capacidad mínima es de 4 personas' })
  capacity: number;

  @ApiProperty({ example: '1', description: 'Id del trabajador responsable' })
  @IsNumber()
  @Min(1, { message: 'El id del trabajador responsable es requerido' })
  responsibleWorker: number;

  @ApiProperty({
    example: [2, 3],
    description: 'Ids de los trabajadores asistentes',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'assistantWorkers debe ser un array' })
  @IsNumber(
    {},
    { each: true, message: 'Cada assistantWorker debe ser un número' },
  )
  @Min(1, {
    each: true,
    message: 'Cada id de assistantWorker debe ser al menos 1',
  })
  assistantWorkers?: number[];

  @ApiProperty({ example: true, description: 'Estado de la instalacion' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: [1, 2], description: 'Ids de los tipos de membresía' })
  @IsArray()
  @IsNumber({}, { each: true, message: 'Cada elemento debe ser un número' })
  @Min(1, { each: true, message: 'Cada id de tipo de membresía debe ser al menos 1' })
  membershipTypeIds: number[];
  
  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;
  
}
