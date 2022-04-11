import { Recipe } from "src/helpers/entities/recipe.entity";
import { EntityRepository, Repository } from "typeorm";
import { Ingriedient } from "../entities/ingriedient.entity";

@EntityRepository(Recipe)
export class RecipeRepository extends Repository<Recipe>{}

@EntityRepository(Ingriedient)
export class IngriedientRepository extends Repository<Ingriedient>{}