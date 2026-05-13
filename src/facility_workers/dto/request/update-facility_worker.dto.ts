import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFacilityWorkerDto } from './create-facility_worker.dto';
import { IsNumber, Min } from 'class-validator';

export class UpdateFacilityWorkerDto extends PartialType(CreateFacilityWorkerDto) {
    @ApiProperty({ example: 1, description: 'ID del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId?: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    @IsNumber({}, { message: 'facilityId debe ser un número' })
    @Min(1, { message: 'facilityId debe ser al menos 1' })
    facilityId?: number;
}
