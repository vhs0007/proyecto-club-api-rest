import { ApiProperty } from '@nestjs/swagger';

export class UpdateExpirationDto {
  @ApiProperty({ example: 1, required: false })
  memberId?: number;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  expirationDate?: Date;

  @ApiProperty({ example: 1, required: false })
  membershipId?: number;
}
