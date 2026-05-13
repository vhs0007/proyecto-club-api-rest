import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";
import type{ FacilityNavigation, UserNavigation } from "../../repository/facility_workers.repository";

export class FacilityWorkerResponseDto {
    @ApiProperty({ example: 1, description: 'ID del trabajador de instalación' })
    id: number;

    @ApiProperty({ example: 1, description: 'ID del club' })
    clubId: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    facilityNavigation: FacilityNavigation;

    @ApiProperty({ example: 1, description: 'ID del usuario' })
    userNavigation: UserNavigation;

}