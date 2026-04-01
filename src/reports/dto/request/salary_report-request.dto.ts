import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class SalaryReportRequestDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNumber({}, { message: 'userId debe ser un número' })
  userId: number;

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