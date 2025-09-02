import { NextFunction, Request, Response } from "express";

interface ISignUp{
    name:string , 
    email:string ,
    password :string,
    cPassword:string 
}


class UserService{
    signUp = (req: Request, res: Response , next: NextFunction)=>{
        const {name , email , password ,cPassword }:ISignUp = req.body;
        return res.status(200).json({message :"success" })



    }
    signIn= (req: Request, res: Response , next: NextFunction)=>{
        const { email , password  }:ISignUp = req.body;
        return res.status(200).json({message :"success" })
    }
}

export default new UserService;