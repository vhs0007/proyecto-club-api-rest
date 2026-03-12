import { Module } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  providers: [LoggerMiddleware],
  exports: [LoggerMiddleware],
})
export class CommonModule {}
