import { BadRequestException, HttpStatus, InternalServerErrorException } from "@nestjs/common";
import { Response } from "express";

export function generic_bad_request_err(required_field: string){
    throw new BadRequestException(`${required_field} is required as input for this endpoint.`)
}

export function generic_internal_server_err(err: any){
    //TODO! Type = Technical debt, Task = Use application error logging framework like AppDynamics, cloudwatch to keep track of application errors and notify web masters.
    throw new InternalServerErrorException('An unknown error occured whilst processing your request. The technical team has been alerted.');
}