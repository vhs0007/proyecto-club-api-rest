import { ApiProperty } from '@nestjs/swagger';

export class ExpirationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  memberId: number;

  @ApiProperty()
  expirationDate: Date;

  @ApiProperty()
  membershipId: number;
}
