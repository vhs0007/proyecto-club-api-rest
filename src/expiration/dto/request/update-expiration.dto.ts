import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsDate, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateExpirationDto {
  @ApiProperty({
    example: '2026-12-31',
    required: false,
    description: 'Fecha de expiración (solo fecha "YYYY-MM-DD" o ISO 8601 con hora)',
  })
  @IsOptional()
  @Transform(({ value }) => (value == null || value === undefined || value instanceof Date ? value : new Date(value)))
  @IsDate({ message: 'expirationDate debe ser una fecha válida (ej: 2026-12-31 o ISO con hora)' })
  expirationDate?: Date;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'membershipId debe ser un número' })
  @Min(1, { message: 'membershipId debe ser al menos 1' })
  membershipId?: number;
}
