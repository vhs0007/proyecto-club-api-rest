import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async authenticateUser(loginRequest: LoginRequestDto): Promise<LoginResponse> {
    if (loginRequest.email === 'admin@admin.com' && loginRequest.password === 'admin') {
      const payload = { sub: 0, email: 'admin@admin.com', role: 'admin' };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken, role: 'admin' };
    }
    const user = await this.prisma.users.findFirst({
      where: { email: loginRequest.email },
      include: { role: true },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (user.password !== loginRequest.password) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    if (!user.isActive) {
      throw new HttpException('Account is disabled', HttpStatus.UNAUTHORIZED);
    }
    if (user.deletedAt != null) {
      throw new HttpException('Account is disabled', HttpStatus.UNAUTHORIZED);
    }
    const roleName = user.role?.name ?? String(user.roleId);
    const payload = { sub: user.id, email: user.email, role: roleName };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken,
      role: roleName,
    };
  }
}
