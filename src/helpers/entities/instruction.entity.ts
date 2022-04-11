import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity()
export class Instruction{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: true})
    name: string;

    @ManyToOne(type => Recipe, recipe => recipe.instructions)
    recipe: Recipe;
}