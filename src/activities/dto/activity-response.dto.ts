import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  startAt: Date;

  @ApiProperty()
  endAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  cost: number;

  @ApiProperty()
  facilityId: number;

  @ApiProperty()
  isActive: boolean;
}
