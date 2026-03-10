import { ApiProperty } from '@nestjs/swagger';

export class UpdateFacilityDto {
  @ApiProperty({ example: 'Sala de musculación', required: false })
  type?: string;

  @ApiProperty({ example: 10, required: false })
  capacity?: number;

  @ApiProperty({ example: 1, required: false })
  responsibleWorker?: number;

  @ApiProperty({ example: 1, required: false })
  assistantWorker?: number | null;

  @ApiProperty({ example: true, required: false })
  isActive?: boolean;

  @ApiProperty({ example: [1, 2], required: false })
  membershipIds?: number[];
}
