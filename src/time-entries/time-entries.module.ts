import { Module } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { TimeEntriesController } from './time-entries.controller';
import { TimeEntryRepository } from './repository/time-entry.repository.impl';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TimeEntriesController],
  providers: [TimeEntriesService, TimeEntryRepository],
})
export class TimeEntriesModule {}
