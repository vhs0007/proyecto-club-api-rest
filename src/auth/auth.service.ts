import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginRequest } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  users: { id: number; email: string; password: string; role: string }[] = [
    {
      id: 1,
      email: 'admin@admin.com',
      password: 'admin',
      role: 'admin',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  authenticateUser(loginRequest: LoginRequest): LoginResponse {
    const user = this.users.find(
      (u) =>
        u.email === loginRequest.email && u.password === loginRequest.password,
    );
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      role: user.role,
    };
  }
}
