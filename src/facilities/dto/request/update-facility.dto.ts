import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min } from 'class-validator';

export class UpdateFacilityDto {
  @ApiProperty({ example: 'Sala de musculación', required: false })
  @IsOptional()
  @IsString({ message: 'type debe ser un texto' })
  type?: string;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'capacity debe ser un número' })
  @Min(4, { message: 'La capacidad mínima es de 4 personas' })
  capacity?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'responsibleWorker debe ser un número' })
  @Min(1, { message: 'El id del trabajador responsable debe ser al menos 1' })
  responsibleWorker?: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'assistantWorker debe ser un número' })
  @Min(1, { message: 'El id del trabajador asistente debe ser al menos 1' })
  assistantWorker?: number | null;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser true o false' })
  isActive?: boolean;

  @ApiProperty({ example: [1, 2], description: 'Ids de los tipos de membresía', required: false })
  @IsOptional()
  @IsArray({ message: 'membershipTypeIds debe ser un array' })
  @IsNumber({}, { each: true, message: 'Cada id de tipo de membresía debe ser un número' })
  @Min(1, { each: true, message: 'Cada id de tipo de membresía debe ser al menos 1' })
  membershipTypeIds?: number[];
}
