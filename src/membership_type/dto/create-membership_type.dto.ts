import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateMembershipTypeDto {
  @ApiProperty({ example: 'Premium', description: 'Nombre del tipo de membresía' })
  @IsString()
  name: string;

  @ApiProperty({ example: 29.99, description: 'Precio' })
  @IsNumber()
  @Min(0)
  price: number;
}
