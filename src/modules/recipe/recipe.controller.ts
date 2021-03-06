import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Recipe } from 'src/helpers/entities/recipe.entity';
import { generic_bad_request_err, generic_internal_server_err } from 'src/helpers/generic-handler';
import { FileInterceptorExtender } from 'src/helpers/interceptors/file-extender.interceptor';
import { IRecipe } from 'src/helpers/interfaces/recipe.interface';
import { S3Service } from '../shared/s3/s3/s3.service';
import { RecipeService } from './recipe.service';

@ApiTags('Recipes')
@Controller('recipe')
export class RecipeController {

    /**
     *
     */
    constructor(
        private _recipeService: RecipeService,
        private _s3Service: S3Service,
    ) {
        
    }

    @Post('add')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: Recipe, description: ''})
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptorExtender) //? INFO: Out of the box interceptor is known for dropping objects in the req body when there's an image, use this interceptor to retain them as image meta-data values (bit hacky but it works), Reference = https://stackoverflow.com/questions/66605192/file-uploading-along-with-other-data-in-swagger-nestjs
    @UseInterceptors(FileInterceptor('file')) //! Technical debt, Type = Refactor, Task = This should ideally be refactored into a lambda function callable with an HTTPS endpoint to offload the heavy lifting of handling files in the backend (This will ofcourse not be done for the REPL recipe project.). Reference = https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html
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
        description: 'Accepts a file input, stores recipe metadata to the database and uploads to S3.'
    })
    async add_recipe(
        @UploadedFile() recipe_image: any,
        @Res() res: Response,
    ){
        if(!recipe_image){
            generic_bad_request_err(res,'Recipe details');
            return;
        }

        const {originalname, mimetype, buffer} = recipe_image;

        if(!(mimetype as string).includes('image')){ //Incase front-end checks are by-passed. 
            generic_bad_request_err(res, 'Recipe image');
        }

        const recipe: IRecipe = {
            title: recipe_image['title'],
            meal_type: recipe_image['meal_type'],
            serves: recipe_image['serves'],
            difficulty_level: recipe_image['difficulty_level'],
            instructions: recipe_image['instructions'],
            ingriedients: JSON.parse(recipe_image['ingriedients']),
            recipe_image_name: originalname,
        }

        //! TODO: Type = Technical debt, Task = Steganography is an underrated attack vector, all uploaded images should be scanned and user identifying meta-data such as GPS co-ordinates, email, names, etc should be stripped from images before uploading to S3.(This of course, will not be done for the REPL recipe project.) Useful read = https://medium.com/@beirikui1985/capture-image-from-scanner-and-webcam-in-javascript-6d6d15aed465 
        const upload_result = await this._s3Service.uploadToS3(originalname, buffer);

        if(upload_result.$metadata.httpStatusCode !== HttpStatus.OK){
            generic_internal_server_err(res, 'An unknown error occured whilst uploading to S3.');
            return ;
        }

        await this._recipeService.saveRecipe(recipe).then(async (result) => {
            recipe.ingriedients.forEach(x => {
                x.recipeId = result.id;
            });

            await this._recipeService.saveIngriedients(recipe.ingriedients);

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

        await this._recipeService.getRecipe(+id).then(async recipe => {
            recipe.recipe_image_name = await this._s3Service.get_s3_pre_signed_url(recipe.recipe_image_name); 

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
