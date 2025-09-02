import { Router } from "express";
import US from './users.service'
import { validation } from "../../middleware/validation";
import { signUpSchema } from "./users.validator";
const userRouter = Router()

userRouter.post("/signUp", validation(signUpSchema) , US.signUp )
userRouter.post("/signIn" , US.signIn )



export default userRouter ;