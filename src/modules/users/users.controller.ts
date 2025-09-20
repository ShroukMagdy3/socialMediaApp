import { Router } from "express";
import US from './users.service'
import { validation } from "../../middleware/validation";
import { confirmEmailSchema, confirmEnable2FASchema, confirmLoginSchema, forgetPassSchema, loginWithGmailSchema, LogOutSchema, resetPassSchema, signInSchema, signUpSchema, updateEmailSchema, updateInfoSchema, updatePasswordSchema } from "./users.validator";
import { Authentication } from "../../middleware/authentication";
import { TokenType } from "../../utilities/token";
const userRouter = Router()

userRouter.post("/signUp", validation(signUpSchema) , US.signUp )
userRouter.patch("/confirmEmail", validation(confirmEmailSchema) , US.confirmEmail )

userRouter.post("/signIn" ,validation(signInSchema) , US.signIn )
userRouter.get("/getProfile",Authentication(), US.getProfile )
userRouter.post("/logOut", validation(LogOutSchema) ,Authentication(), US.LogOut )
userRouter.get("/refreshToken" ,Authentication(TokenType.refresh), US.refreshToken )
userRouter.post("/loginWithGmail" ,validation(loginWithGmailSchema), US.loginWithGmail )
userRouter.patch("/forgetPass" ,validation(forgetPassSchema), US.forgetPass )
userRouter.patch("/resetPass" ,validation(resetPassSchema), US.resetPass )
userRouter.patch("/updatePass",Authentication() , validation(updatePasswordSchema), US.updatePass )
userRouter.put("/updateInfo",Authentication() , validation(updateInfoSchema), US.updateInfo )
userRouter.patch("/updateEmail",Authentication() , validation(updateEmailSchema), US.updateEmail )



// 2 step verification
userRouter.post("/enable-2fa",Authentication() ,US.enable2FA);
userRouter.post("/confirmEnable2FA" ,Authentication() ,validation(confirmEnable2FASchema), US.confirmEnable2FA);
userRouter.post("/confirmLogin" ,validation(confirmLoginSchema), US.confirmLogin);




export default userRouter ;