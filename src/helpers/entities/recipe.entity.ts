import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DIFFICULTY_LEVEL, IRecipe, MEAL_TYPE } from "../interfaces/recipe.interface";
import { Ingriedient } from "./ingriedient.entity";
import { Instruction } from "./instruction.entity";

@Entity()
export class Recipe implements IRecipe{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable: true})
    title: string;

    @Column({nullable: true, type: 'nvarchar'})
    meal_type: MEAL_TYPE;

    @Column({nullable: true})
    serves: number;
    
    @Column({nullable: true, type: 'nvarchar'})
    difficulty_level: DIFFICULTY_LEVEL;

    @Column({nullable: true})
    recipe_image_name: string;

    @Column({nullable: true})
    instructions: string;

    @OneToMany(type => Ingriedient, ingriedients => ingriedients.recipe, {eager: true})
    ingriedients?: Ingriedient[];
}