import { Test, TestingModule } from '@nestjs/testing';
import { MealDbService } from './meal-db.service';

describe('MealDbService', () => {
  let service: MealDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MealDbService],
    }).compile();

    service = module.get<MealDbService>(MealDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
