import { Module } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { ExpirationController } from './expiration.controller';

@Module({
  controllers: [ExpirationController],
  providers: [ExpirationService],
})
export class ExpirationModule {}
