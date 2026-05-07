import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateMembershipDto {
  @ApiProperty({
    example: 1,
    description: 'Id tipo membresía',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'type debe ser un número' })
  @Min(1, { message: 'type debe ser al menos 1' })
  type?: number;

  @ApiProperty({ example: 1, description: 'Id del usuario', required: false })
  @IsOptional()
  @IsNumber({}, { message: 'userId debe ser un número' })
  @Min(1, { message: 'userId debe ser al menos 1' })
  userId?: number;

  @ApiProperty({
    example: 1,
    description: 'Id del tipo de usuario',
    required: false,
  })
  @IsNumber({}, { message: 'userTypeId debe ser un número' })
  @Min(1, { message: 'userTypeId debe ser al menos 1' })
  userTypeId: number;

  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  @Min(1, { message: 'clubId debe ser al menos 1' })
  clubId: number;
}
