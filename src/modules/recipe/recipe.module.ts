import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeController } from './recipe.controller';
import { RecipeService } from './recipe.service';
import { IngriedientRepository, RecipeRepository } from 'src/helpers/repositories/recipe.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RecipeRepository,
      IngriedientRepository,
    ])
  ],
  controllers: [RecipeController],
  providers: [RecipeService]
})
export class RecipeModule {}
