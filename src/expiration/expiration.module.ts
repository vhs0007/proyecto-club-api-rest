import { Module } from '@nestjs/common';
import { ExpirationService } from './expiration.service';
import { ExpirationController } from './expiration.controller';
import { ExpirationRepository } from './repository/expiration.repository.impl';

@Module({
  controllers: [ExpirationController],
  providers: [ExpirationService, ExpirationRepository],
})
export class ExpirationModule {}
