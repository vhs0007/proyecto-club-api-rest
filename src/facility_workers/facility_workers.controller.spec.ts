import { Test, TestingModule } from '@nestjs/testing';
import { FacilityWorkersController } from './facility_workers.controller';
import { FacilityWorkersService } from './facility_workers.service';

describe('FacilityWorkersController', () => {
  let controller: FacilityWorkersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacilityWorkersController],
      providers: [FacilityWorkersService],
    }).compile();

    controller = module.get<FacilityWorkersController>(FacilityWorkersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
