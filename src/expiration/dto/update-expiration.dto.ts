import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDateString, Min } from 'class-validator';

export class UpdateExpirationDto {
  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'expirationDate debe ser una fecha válida en formato ISO' })
  expirationDate?: Date;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'membershipId debe ser un número' })
  @Min(1, { message: 'membershipId debe ser al menos 1' })
  membershipId?: number;
}
