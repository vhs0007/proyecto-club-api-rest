import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
export class QueryScheduledActivityDto {
    @ApiProperty({ example: 1, description: 'Id del club' })
    @IsNumber({}, { message: 'clubId debe ser un número' })
    @Min(1, { message: 'clubId debe ser al menos 1' })
    clubId: number;

    @ApiProperty({ example: 1, description: 'Id de la actividad rutinaria' })
    @IsNumber({}, { message: 'id debe ser un número' })
    @Min(1, { message: 'id debe ser al menos 1' })
    id: number;
}