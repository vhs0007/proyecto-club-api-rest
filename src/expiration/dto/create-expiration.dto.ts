import { ApiProperty } from '@nestjs/swagger';

export class CreateExpirationDto {
  @ApiProperty({ example: 1, description: 'Id del socio (member)' })
  memberId: number;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', description: 'Fecha de expiración' })
  expirationDate: Date;

  @ApiProperty({ example: 1, description: 'Id de la membresía' })
  membershipId: number;
}
