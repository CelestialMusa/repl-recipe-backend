import { BadRequestException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { Response } from "express";

export function generic_bad_request_err(res: Response, required_field: string){
    res.status(HttpStatus.BAD_REQUEST).send({error: `${required_field} is required as input for this endpoint.`});
}

export function generic_internal_server_err(res: Response, err: any){
    console.log(err)
    //TODO! Type = Technical debt, Task = Use application error logging framework like AppDynamics, cloudwatch to keep track of application errors and notify web masters.
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({error: 'An unknown error occured whilst processing your request. The technical team has been alerted.'});
}