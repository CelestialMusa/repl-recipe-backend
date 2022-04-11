import { Ingriedient } from "src/helpers/entities/ingriedient.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Ingriedient)
export class IngriedientRepository extends Repository<Ingriedient>{}