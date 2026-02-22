import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import type { LoginRequest } from './dto/login-request.dto';
import type { LoginResponse } from './dto/login-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  login(@Body() loginRequest: LoginRequest): LoginResponse {
    return this.authService.authenticateUser(loginRequest);
  }
}
