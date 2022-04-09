import { Test, TestingModule } from '@nestjs/testing';
import { MealDbController } from './meal-db.controller';

describe('MealDb Controller', () => {
  let controller: MealDbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MealDbController],
    }).compile();

    controller = module.get<MealDbController>(MealDbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
