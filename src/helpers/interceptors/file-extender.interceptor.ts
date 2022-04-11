import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class FileInterceptorExtender implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {        
        const req = context.switchToHttp().getRequest();
        
        req.file['title'] = req.body?.title;
        req.file['meal_type'] = req.body?.meal_type;
        req.file['serves'] = req.body?.serves;
        req.file['difficulty_level'] = req.body?.difficulty_level;
        req.file['instructions'] = req.body?.instructions;
        req.file['ingriedients'] = req.body?.ingriedients;

        return next.handle();
    }
}