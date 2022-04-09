import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '../shared/config/config.service';

@Injectable()
export class MealDbService {

    /**
     *
     */
    constructor(
        private _http: HttpService,
        private _config: ConfigService,
        ) {
        
    }

    async search(query_string){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}search.php?s=${query_string}`).toPromise();
    }

    async get_meal_by_first_letter(letter: string){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}search.php?f=${letter}`).toPromise();
    }

    async get_meal_by_id(meal_id){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}lookup.php?i=${meal_id}`).toPromise();
    }

    async get_meal_categories(){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}categories.php`).toPromise();
    }

    async filter_by_category(category: string){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}filter.php?c=${category}`).toPromise();
    }

    async filter_by_area(area: string){
        return await this._http.get(`${this._config.get('MEAL_DB_API_URL')}a=${area}`).toPromise();
    }
}
