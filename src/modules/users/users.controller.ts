import { Router } from "express";
import US from './users.service'
import { validation } from "../../middleware/validation";
import { confirmEmailSchema, LogOutSchema, signInSchema, signUpSchema } from "./users.validator";
import { Authentication } from "../../middleware/authentication";
import { TokenType } from "../../utilities/token";
const userRouter = Router()

userRouter.post("/signUp", validation(signUpSchema) , US.signUp )
userRouter.patch("/confirmEmail", validation(confirmEmailSchema) , US.confirmEmail )

userRouter.post("/signIn" ,validation(signInSchema) , US.signIn )
userRouter.get("/getProfile",Authentication(), US.getProfile )
userRouter.post("/logOut", validation(LogOutSchema) ,Authentication(), US.LogOut )
userRouter.get("/refreshToken" ,Authentication(TokenType.refresh), US.refreshToken )





export default userRouter ;