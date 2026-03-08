import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Email del usuario' })
  email: string;

  @ApiProperty({ example: 'miPassword123', description: 'Contraseña' })
  password: string;
}