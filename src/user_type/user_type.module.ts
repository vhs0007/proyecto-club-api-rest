import { Module } from '@nestjs/common';
import { UserTypeService } from './user_type.service';
import { UserTypeController } from './user_type.controller';
import { UserTypeRepository } from './repository/user_type.repository.impl';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserTypeController],
  providers: [UserTypeService, UserTypeRepository],
})
export class UserTypeModule {}
