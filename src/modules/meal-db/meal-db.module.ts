import { Module } from '@nestjs/common';
import { MealDbController } from './meal-db.controller';
import { MealDbService } from './meal-db.service';

@Module({
  controllers: [MealDbController],
  providers: [MealDbService]
})
export class MealDbModule {}
