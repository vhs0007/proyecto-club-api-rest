import { Test, TestingModule } from '@nestjs/testing';
import { MembershipTypeController } from './membership_type.controller';
import { MembershipTypeService } from './membership_type.service';

describe('MembershipTypeController', () => {
  let controller: MembershipTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipTypeController],
      providers: [MembershipTypeService],
    }).compile();

    controller = module.get<MembershipTypeController>(MembershipTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
