import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMembershipDto {
  @ApiProperty({ example: 1, description: 'Id tipo membresía', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'type debe ser un número' })
  @Min(1, { message: 'type debe ser al menos 1' })
  type?: number;

  @ApiProperty({ example: 1, description: 'Id del usuario', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId?: number;
}
