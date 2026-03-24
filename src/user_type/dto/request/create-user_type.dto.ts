import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateUserTypeDto {
  @ApiProperty({ example: 'worker', description: 'Nombre del tipo de usuario' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;
}
