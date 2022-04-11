import { Injectable } from '@nestjs/common';
import { Recipe } from 'src/helpers/entities/recipe.entity';
import { Ingriedient, IRecipe } from 'src/helpers/interfaces/recipe.interface';
import { IngriedientRepository, RecipeRepository } from 'src/helpers/repositories/recipe.repository';

@Injectable()
export class RecipeService {

    /**
     *
     */
    constructor(
        private _recipeRepo: RecipeRepository,
        private _ingredientRepo: IngriedientRepository,
    ) {
        
    }

    async getRecipe(id: number){
        return await this._recipeRepo.createQueryBuilder()
            .select()
            .where('id = :id', {id})
            .getOne();
    }

    async getRecipes(limit: number){
        return await this._recipeRepo.createQueryBuilder()
            .select()
            .limit(limit)
            .getMany();
    }

    async saveRecipe(recipe: IRecipe){
        return await this._recipeRepo.save(recipe);
    }

    async saveIngriedients(ingriedients: Ingriedient[]){
        return await this._ingredientRepo.save(ingriedients);
    }
}
