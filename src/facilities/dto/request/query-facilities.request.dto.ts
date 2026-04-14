import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class QueryFacilitiesRequestDto {
  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;

  @ApiProperty({ example: 1, description: 'Id de la instalacion' })
  @IsNumber({}, { message: 'Id debe ser un número' })
  @Min(1, { message: 'Id debe ser al menos 1' })
  id: number;
}