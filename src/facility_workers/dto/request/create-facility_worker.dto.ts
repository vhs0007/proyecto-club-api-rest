import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class CreateFacilityWorkerDto {
    @ApiProperty({ example: 1, description: 'ID del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    @IsNumber({}, { message: 'facilityId debe ser un número' })
    @Min(1, { message: 'facilityId debe ser al menos 1' })
    facilityId: number;

    @ApiProperty({ example: 1, description: 'ID del usuario' })
    @IsNumber({}, { message: 'userId debe ser un número' })
    @Min(1, { message: 'userId debe ser al menos 1' })
    userId: number;

    @ApiProperty({ example: 1, description: 'ID del tipo de usuario' })
    @IsNumber({}, { message: 'userTypeId debe ser un número' })
    @Min(1, { message: 'userTypeId debe ser al menos 1' })
    userTypeId: number;
}
