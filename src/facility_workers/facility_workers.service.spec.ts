import { Test, TestingModule } from '@nestjs/testing';
import { FacilityWorkersService } from './facility_workers.service';

describe('FacilityWorkersService', () => {
  let service: FacilityWorkersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacilityWorkersService],
    }).compile();

    service = module.get<FacilityWorkersService>(FacilityWorkersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
