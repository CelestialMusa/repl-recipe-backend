import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MealDbModule } from './modules/meal-db/meal-db.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './modules/shared/shared.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { ConfigService } from './modules/shared/config/config.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ConfigService) => 
        configService.typeOrmSQLiteDB,
      inject: [ConfigService],
    }), 
    MealDbModule, 
    UserModule,  
    RecipeModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
