import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserTypeDto {
  @ApiProperty({ example: 'worker', description: 'Nombre del tipo de usuario' })
  @IsString()
  name: string;
}
