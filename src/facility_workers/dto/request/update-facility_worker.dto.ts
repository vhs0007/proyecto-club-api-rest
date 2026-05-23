import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFacilityWorkerDto } from './create-facility_worker.dto';
import { ArrayMinSize, Equals, IsArray, IsNumber, Min, ValidateIf } from 'class-validator';

export class UpdateFacilityWorkerDto extends PartialType(CreateFacilityWorkerDto) {
    @ApiProperty({ example: 1, description: 'ID del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId?: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    @IsArray({ message: 'facilityId debe ser un array de números' })
    @ArrayMinSize(1, { message: 'facilityId debe tener al menos un elemento' })
    @IsNumber({}, { each: true, message: 'Cada facilityId debe ser un número' })
    @Min(1, { each: true, message: 'Cada facilityId debe ser al menos 1' })
    facilityId?: number[];

    @ApiProperty({ example: 1, description: 'ID del usuario del trabajador responsable' })
    @IsNumber({}, { message: 'userId debe ser un número' })
    @Min(1, { message: 'userId debe ser al menos 1' })
    userId?: number;

    @ApiProperty({ example: 1, description: 'Debe ser 1 (trabajador) si se envía' })
    @ValidateIf((o) => o.userTypeId !== undefined)
    @IsNumber({}, { message: 'userTypeId debe ser un número' })
    @Equals(1, { message: 'userTypeId debe ser 1 (solo trabajadores)' })
    userTypeId?: number;
}
