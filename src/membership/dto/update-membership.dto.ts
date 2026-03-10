import { ApiProperty } from '@nestjs/swagger';

export class UpdateMembershipDto {
  @ApiProperty({ example: 1, description: 'Id tipo membresía', required: false })
  type?: number;

  @ApiProperty({ example: 200, description: 'Precio', required: false })
  price?: number;

  @ApiProperty({ example: ['Gym'], description: 'Salas incluidas', required: false })
  facilitiesIncluded?: string[];
}
