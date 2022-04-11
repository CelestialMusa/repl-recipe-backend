import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Recipe } from "./recipe.entity";

@Entity()
export class Ingriedient{
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({nullable: true})
    name: string;

    @Column({nullable: true})
    amount: number;

    @ManyToOne(type => Recipe, recipe => recipe.ingriedients,)
    recipe?: Recipe;
}