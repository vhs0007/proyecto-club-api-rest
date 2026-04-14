import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, Min } from "class-validator";

export class QueryUserRequestDto {
  @ApiProperty({ example: 1, description: 'ID del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;

  @ApiProperty({ example: 1, description: 'ID del usuario' })
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId: number;

  @ApiProperty({ example: 3, description: 'ID del tipo de usuario a filtrar' })
  @IsNumber({}, { message: 'typeId debe ser un número' })
  @Min(1, { message: 'typeId debe ser al menos 1' })
  typeId: number;
}