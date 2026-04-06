import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Email del usuario' })
  @IsEmail({}, { message: 'email debe ser un correo válido' })
  email: string;

  @ApiProperty({ example: 'miPassword123', description: 'Contraseña' })
  @IsString({ message: 'password debe ser un texto' })
  @MinLength(1, { message: 'password es requerido' })
  password: string;

  @ApiProperty({ example: 1, description: 'Id del club' })
  @IsNumber({}, { message: 'clubId debe ser un número' })
  clubId:number;
}
