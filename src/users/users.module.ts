import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { UsersRepository } from './users.repository';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, UsersRepository],
})
export class UsersModule {}
