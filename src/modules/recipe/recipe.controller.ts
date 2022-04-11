import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Recipe } from 'src/helpers/entities/recipe.entity';
import { generic_bad_request_err, generic_internal_server_err } from 'src/helpers/generic-handler';
import { FileInterceptorExtender } from 'src/helpers/interceptors/file-extender.interceptor';
import { IRecipe } from 'src/helpers/interfaces/recipe.interface';
import { RecipeService } from './recipe.service';

@ApiTags('Recipes')
@Controller('recipe')
export class RecipeController {

    /**
     *
     */
    constructor(
        private _recipeService: RecipeService,
    ) {
        
    }

    @Post('add')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: Recipe, description: ''})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptorExtender) //Info: Out of the box interceptor is known for dropping objects in the req body when there's an image, use this interceptor to retain them as image meta-data values (bit hacky but it works), Reference = https://stackoverflow.com/questions/66605192/file-uploading-along-with-other-data-in-swagger-nestjs
    @UseInterceptors(FileInterceptor('file'))
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                meal_type: {type: 'string'},
                serves: {type: 'string'},
                difficulty_level: {type: 'string'},
                instructions: {type: 'string'},
                ingriedients: {type: 'array', items: {type: 'string'}},
                file: {type: 'string', format: 'binary'}
            }
        },
        description: 'Accepts a file input, stores metadata to the database and uploads to S3.'
    })
    async add_recipe(
        @UploadedFile() recipe_image: any,
        @Res() res: Response,
    ){
        if(!recipe_image){
            generic_bad_request_err(res,'Recipe details');
            return;
        }

        const recipe: IRecipe = {
            title: recipe_image['title'],
            meal_type: recipe_image['meal_type'],
            serves: recipe_image['serves'],
            difficulty_level: recipe_image['difficulty_level'],
            instructions: recipe_image['instructions'],
            ingriedients: JSON.parse(recipe_image['ingriedients']),
        }

        this._recipeService.saveRecipe(recipe).then(async (result) => {
            // recipe.ingriedients.forEach(x => {
            //     x.recipeId = result.id;
            // });

            // await this._recipeService.saveIngriedients(recipe.ingriedients);

            res.status(HttpStatus.OK).send(result);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }

    @Get('details/:id')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: Recipe, description: ''})
    async get_recipe_details(
        @Param('id') id: string,
        @Res() res: Response,
    ){
        if(!id){
            generic_bad_request_err(res, 'Recipe id');
            return;
        }

        await this._recipeService.getRecipe(+id).then(recipe => {
            res.status(HttpStatus.OK).send(recipe);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }

    @Get('list/:limit')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: [Recipe], description: ''})
    async get_recipe_list(
        @Param('limit') limit: string,
        @Res() res: Response,
    ){
        await this._recipeService.getRecipes(+limit ?? 25).then(recipes => {
            res.status(HttpStatus.OK).send(recipes);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }
}
