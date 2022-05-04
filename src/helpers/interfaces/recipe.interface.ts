export interface IRecipe{
    title: string;
    meal_type: MEAL_TYPE,
    serves: number,
    difficulty_level: DIFFICULTY_LEVEL,
    ingriedients?: Ingriedient[],
    instructions: string,
    recipe_image_name?: string,
}

export enum MEAL_TYPE{
    BREAK_FAST = 'Breakfast',
    LUNCH = 'Lunch',
    SUPPER = 'Supper',
    Snack = 'Snack'
}

export enum DIFFICULTY_LEVEL{
    BEGINNER = 'Beginner',
    INTERMIDIATE = 'Intermidiate',
    ADVANCED = 'Advanced',
}

export interface Ingriedient{
    name: string,
    amount: number,
    recipeId?: number,
}