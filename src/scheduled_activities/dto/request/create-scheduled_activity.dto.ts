import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Equals, IsArray, IsNumber, IsString, Min, ValidateNested } from 'class-validator';

export class DatetimeScheduledActivity {
    @ApiProperty({ example: '10:00', description: 'Hora de inicio' })
    @IsString({ message: 'hourStart debe ser un texto' })
    hourStart: string;

    @ApiProperty({ example: '12:00', description: 'Hora de fin' })
    @IsString({ message: 'hourEnd debe ser un texto' })
    hourEnd: string;

    @ApiProperty({ example: 1, description: 'ID del día de la semana' })
    @IsNumber({}, { message: 'workingDayId debe ser un número' })
    @Min(1, { message: 'workingDayId debe ser al menos 1' })
    workingDayId: number;
}

export class CreateScheduledActivityDto {
    @ApiProperty({ example: 1, description: 'ID del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    @IsNumber({}, { message: 'facilityId debe ser un número' })
    @Min(1, { message: 'facilityId debe ser al menos 1' })
    facilityId: number;

    @ApiProperty({ example: 1, description: 'ID del trabajador responsable' })
    @IsNumber({}, { message: 'userId debe ser un número' })
    @Min(1, { message: 'userId debe ser al menos 1' })
    userId: number;

    @ApiProperty({ example: 1, description: 'ID del tipo de usuario del trabajador responsable' })
    @IsNumber({}, { message: 'userTypeId debe ser un número' })
    @Equals(1, { message: 'userTypeId debe ser 1 (solo trabajadores)' })
    userTypeId: number;

    @ApiProperty({ example: [1, 2], description: 'IDs de los tipos de membresía' })
    @IsArray({ message: 'membershipTypesIds debe ser un array' })
    @IsNumber({}, { each: true, message: 'Cada membershipTypeId debe ser un número' })
    @Min(1, { each: true, message: 'Cada membershipTypeId debe ser al menos 1' })
    membershipTypesIds: number[];

    @ApiProperty({ example: [{ hourStart: '10:00', hourEnd: '12:00', workingDayId: 1 }, { hourStart: '13:00', hourEnd: '15:00', workingDayId: 2 }], description: 'Horarios de la actividad' })
    @IsArray({ message: 'datetimeScheduledActivities debe ser un array' })
    @ValidateNested({ each: true })
    @Type(() => DatetimeScheduledActivity)
    datetimeScheduledActivities: DatetimeScheduledActivity[];

    @ApiProperty({ example: [1,2,3], description: 'IDs de los trabajadores asistentes' })
    @IsArray({ message: 'assistantWorkerIds debe ser un array' })
    @IsNumber({}, { each: true, message: 'Cada assistantWorkerId debe ser un número' })
    @Min(1, { each: true, message: 'Cada assistantWorkerId debe ser al menos 1' })
    assistantWorkerIds: number[];

    @ApiProperty({ example: "PRACTICA FUTBOL", description: 'nombre de la actividad rutinaria' })
    @IsString({ message: 'name debe ser un texto' })
    name: string;
}
