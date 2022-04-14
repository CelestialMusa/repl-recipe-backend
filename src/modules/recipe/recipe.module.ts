import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { IngriedientRepository, RecipeRepository } from 'src/helpers/repositories/recipe.repository';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeRepository,
      IngriedientRepository,
    ]),
    SharedModule,
  ],
  controllers: [RecipeController],
  providers: [RecipeService]
})
export class RecipeModule {}
