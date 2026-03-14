import { ApiProperty } from '@nestjs/swagger';

export class UserTypeResponseDto {
  @ApiProperty({ example: 1, description: 'ID del tipo de usuario' })
  id: number;

  @ApiProperty({ example: 'worker', description: 'Nombre del tipo de usuario' })
  name: string;
}
