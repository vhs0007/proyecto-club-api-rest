import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty({ example: 'Partido de fútbol', required: false })
  name?: string;

  @ApiProperty({ example: 'deporte', required: false })
  type?: string;

  @ApiProperty({ example: '2026-03-03T10:00:00.000Z', required: false })
  startAt?: Date;

  @ApiProperty({ example: '2026-03-03T12:00:00.000Z', required: false })
  endAt?: Date;

  @ApiProperty({ example: 1, required: false })
  userId?: number;

  @ApiProperty({ example: 100, required: false })
  cost?: number;

  @ApiProperty({ example: 1, required: false })
  facilityId?: number;

  @ApiProperty({ example: true, required: false })
  isActive?: boolean;
}
