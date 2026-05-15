import { Test, TestingModule } from '@nestjs/testing';
import { ScheduledActivitiesController } from './scheduled_activities.controller';
import { ScheduledActivitiesService } from './scheduled_activities.service';

describe('ScheduledActivitiesController', () => {
  let controller: ScheduledActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduledActivitiesController],
      providers: [ScheduledActivitiesService],
    }).compile();

    controller = module.get<ScheduledActivitiesController>(ScheduledActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
