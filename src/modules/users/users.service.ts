import { NextFunction, Request, Response } from "express";
import { signUpSchemaType } from "./users.validator";
import { DbRepository } from "../../DB/Repositories/db.repository";
import userModel, { IUser } from "../../DB/models/users.model";
import { HydratedDocument } from "mongoose";
import { UserRepository } from "../../DB/Repositories/user.repository";
import { AppError } from "../../utilities/classError";
import { Hash } from "../../utilities/hash";
import { generateOtp, sendEmail } from "../../service/sendEmail";
import { emailTemplate } from "../../service/email.template";
import { eventEmitter } from "../../utilities/events";

class UserService {
  private _userModel = new UserRepository(userModel);
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    const {
      userName,
      email,
      password,
      age,
      gender,
      address,
      phone,
    }: signUpSchemaType = req.body;
    if ((await this._userModel.findOne({ email }))) {
      throw new AppError("email is already exist");
    }
   
    const hash = await Hash(password);
    const user = await this._userModel.createOneUser({
      userName,
      email,
      password: hash,
      age,
      address,
      gender,
      phone,
    });

    eventEmitter.emit("confirmEmail" , {email})

    return res.status(200).json({ message: "success" ,  user });
  };

  signIn = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    return res.status(200).json({ message: "success" });
  };
}

export default new UserService();
