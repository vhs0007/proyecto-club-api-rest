import { ApiProperty } from '@nestjs/swagger';

export class MembershipTypeResponseDto {
  @ApiProperty({ example: 1, description: 'ID del tipo de membresía' })
  id: number;

  @ApiProperty({ example: 'Premium', description: 'Nombre del tipo de membresía' })
  name: string;

  @ApiProperty({ example: 29.99, description: 'Precio de la membresía' })
  price: number;
}
