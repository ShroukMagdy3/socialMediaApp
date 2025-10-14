import {Request, NextFunction, Response } from "express"
import { roleType } from "../DB/models/users.model"
import { AppError } from "../utilities/classError";



export const Authorization = (role : roleType)=>{
return(req : Request , res:Response , next:NextFunction)=>{

    if(role !== roleType.admin){
        throw new AppError("Unauthorized" , 401);
    }
    return next();
}

}