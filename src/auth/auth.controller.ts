import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginRequest } from './dto/login-request.dto';
import type { LoginResponse } from './dto/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginRequest: LoginRequest): LoginResponse {
    return this.authService.authenticateUser(loginRequest);
  }
}
