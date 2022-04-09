import { Module } from '@nestjs/common';
import { ConfigService } from '../shared/config/config.service';
import { SharedModule } from '../shared/shared.module';
import { MealDbController } from './meal-db.controller';
import { MealDbService } from './meal-db.service';

@Module({
  imports: [SharedModule,],
  controllers: [MealDbController],
  providers: [MealDbService, ]
})
export class MealDbModule {}
