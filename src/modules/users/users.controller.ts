import { Router } from "express";
import US from './users.service'
import { validation } from "../../middleware/validation";
import { confirmEmailSchema, signInSchema, signUpSchema } from "./users.validator";
const userRouter = Router()

userRouter.post("/signUp", validation(signUpSchema) , US.signUp )
userRouter.patch("/confirmEmail", validation(confirmEmailSchema) , US.confirmEmail )

userRouter.post("/signIn" ,validation(signInSchema) , US.signIn )



export default userRouter ;