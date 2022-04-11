import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Request, Res } from '@nestjs/common';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { generic_bad_request_err, generic_internal_server_err } from 'src/helpers/generic-handler';
import { MealDbService } from './meal-db.service';

@ApiTags('MealDB')
@Controller('meal-db')
export class MealDbController {

    /**
     *
     */
    constructor(private _mealDbService: MealDbService) {
        
    }

    @Get('search/:query_string')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async search(
        @Param('query_string') query_string: string,
        @Request() req,
        @Res() res: Response
    ){
        if(!query_string){
            generic_bad_request_err(res,'Query string');
            return;
        }

        await this._mealDbService.search(query_string).then(resp => {
            console.log(resp?.data);
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res,err);
        });
    }

    @Get('get_meal_by_first_letter/:letter')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async get_meal_by_first_letter(
        @Param('letter') letter: string,
        @Res() res: Response,
    ){
        if(!letter){
            generic_bad_request_err(res,'First letter of the meal');
            return;
        }

        await this._mealDbService.get_meal_by_first_letter(letter).then(resp => {
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }

    @Get('get_meal_by_id/:meal_id')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async get_meal_by_id(
        @Param('meal_id') meal_id: string,
        @Res() res: Response,
    ){
        if(!meal_id){
            generic_bad_request_err(res ,'Meal ID');
            return;
        }
        await this._mealDbService.get_meal_by_id(meal_id).then(resp => {
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res ,err);
        });
    }

    @Get('get_meal_categories')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async get_meal_categories(
        @Res() res: Response,
    ){
        await this._mealDbService.get_meal_categories().then(resp => {
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res ,err);
        });
    }

    @Get('filter_by_category/:category')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async filter_by_category(
        @Param('category') category: string,
        @Res() res: Response,
    ){
        if(!category){
            generic_bad_request_err(res, 'Meal category');
            return;
        }

        await this._mealDbService.filter_by_category(category).then(resp => {
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }

    @Get('filter_by_area/:area')
    @HttpCode(HttpStatus.OK)
    @HttpCode(HttpStatus.BAD_REQUEST)
    @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
    @ApiOkResponse({type: '', description: ''})
    async filter_by_area(
        @Param('area') area: string,
        @Res() res: Response,
    ){
        if(!area){
            generic_bad_request_err(res, 'Area');
            return;
        }

        await this._mealDbService.filter_by_area(area).then(resp => {
            res.status(HttpStatus.OK).send(resp?.data);
        }).catch(err => {
            generic_internal_server_err(res, err);
        });
    }
}
