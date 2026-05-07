import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class SalaryReportRequestDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNumber({}, { message: 'userId debe ser un número' })
  userId: number;

  @ApiProperty({ example: 1, description: 'ID del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  clubId: number;

  @ApiProperty({ example: 3, description: 'ID del tipo de usuario a filtrar' })
  @IsNumber({}, { message: 'typeId debe ser un número' })
  @Min(1, { message: 'typeId debe ser al menos 1' })
  typeId: number;

  //Las fechas no se utilizan asi que te las voy a comentar pelado
  //Se podria usar las times entries del usuario para hacer un calculo exacto
  //Pero eso lo charlamos lately

  // @ApiProperty({ example: '2026-01-01', description: 'Fecha de inicio' })
  // @IsDateString({}, { message: 'startDate debe ser una fecha válida' })
  // startDate: string;

  // @ApiProperty({ example: '2026-01-01', description: 'Fecha de fin' })
  // @IsDateString({}, { message: 'endDate debe ser una fecha válida' })
  // endDate: string;
}
