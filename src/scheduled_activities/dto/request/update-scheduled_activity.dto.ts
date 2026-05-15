import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateScheduledActivityDto } from './create-scheduled_activity.dto';
import { Equals, IsArray, IsNumber, Min, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DatetimeScheduledActivity } from './create-scheduled_activity.dto';

export class UpdateScheduledActivityDto extends PartialType(CreateScheduledActivityDto) {
    @ApiProperty({ example: 1, description: 'ID del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId?: number;

    @ApiProperty({ example: 1, description: 'ID de la instalación' })
    @IsNumber({}, { message: 'facilityId debe ser un número' })
    @Min(1, { message: 'facilityId debe ser al menos 1' })
    facilityId?: number;

    @ApiProperty({ example: 1, description: 'ID del trabajador responsable' })
    @IsNumber({}, { message: 'userId debe ser un número' })
    @Min(1, { message: 'userId debe ser al menos 1' })
    userId?: number;

    @ApiProperty({ example: 1, description: 'ID del tipo de usuario del trabajador responsable' })
    @ValidateIf((o) => o.userTypeId !== undefined)
    @IsNumber({}, { message: 'userTypeId debe ser un número' })
    @Equals(1, { message: 'userTypeId debe ser 1 (solo trabajadores)' })
    userTypeId?: number;

    @ApiProperty({ example: [1, 2], description: 'IDs de los tipos de membresía' })
    @IsNumber({}, { message: 'membershipTypeId debe ser un número' })
    @Min(1, { message: 'membershipTypeId debe ser al menos 1' })
    membershipTypesIds?: number[];

    @ApiProperty({ example: [{ hourStart: '10:00', hourEnd: '12:00', workingDayId: 1 }, { hourStart: '13:00', hourEnd: '15:00', workingDayId: 2 }], description: 'Horarios de la actividad' })
    @IsArray({ message: 'datetimeScheduledActivities debe ser un array' })
    @ValidateNested({ each: true })
    @Type(() => DatetimeScheduledActivity)
    datetimeScheduledActivities?: DatetimeScheduledActivity[];

    @ApiProperty({ example: [1,2,3], description: 'IDs de los trabajadores asistentes' })
    @IsArray({ message: 'assistantWorkerIds debe ser un array' })
    @IsNumber({}, { each: true, message: 'Cada assistantWorkerId debe ser un número' })
    @Min(1, { each: true, message: 'Cada assistantWorkerId debe ser al menos 1' })
    assistantWorkerIds?: number[];
}
