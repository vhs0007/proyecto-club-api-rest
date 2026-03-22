import { Body, Controller, InternalServerErrorException, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import type { LoginResponse } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginRequestDto })
  login(@Body() loginRequest: LoginRequestDto): Promise<LoginResponse> {
    try{
      return this.authService.authenticateUser(loginRequest);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
