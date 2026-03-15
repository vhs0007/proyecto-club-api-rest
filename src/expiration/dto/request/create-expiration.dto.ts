import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsDate, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateExpirationDto {
  @ApiProperty({
    example: '2026-12-31',
    description: 'Fecha de expiración (solo fecha "YYYY-MM-DD" o ISO 8601 con hora)',
  })
  @Transform(({ value }) => (value == null || value instanceof Date ? value : new Date(value)))
  @IsDate({ message: 'expirationDate debe ser una fecha válida (ej: 2026-12-31 o ISO con hora)' })
  expirationDate: Date;

  @ApiProperty({ example: 1, description: 'Id de la membresía' })
  @IsNumber({}, { message: 'membershipId debe ser un número' })
  @Min(1, { message: 'membershipId debe ser al menos 1' })
  membershipId: number;
}
