import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealDbModule } from './modules/meal-db/meal-db.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forRoot(), MealDbModule, UserModule, SharedModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
