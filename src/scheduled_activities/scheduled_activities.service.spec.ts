import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledActivitiesService } from './scheduled_activities.service';

describe('ScheduledActivitiesService', () => {
  let service: ScheduledActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduledActivitiesService],
    }).compile();

    service = module.get<ScheduledActivitiesService>(ScheduledActivitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
