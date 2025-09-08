import { NextFunction, Request, Response } from "express";
import {
  confirmEmailSchema,
  confirmEmailSchemaType,
  signInSchemaType,
  signUpSchemaType,
} from "./users.validator";
import { DbRepository } from "../../DB/Repositories/db.repository";
import userModel, { IUser } from "../../DB/models/users.model";
import { HydratedDocument } from "mongoose";
import { UserRepository } from "../../DB/Repositories/user.repository";
import { AppError } from "../../utilities/classError";
import { Compare, Hash } from "../../utilities/hash";
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
    if (await this._userModel.findOne({ email })) {
      throw new AppError("email is already exist");
    }

    const hash = await Hash(password);
    const otp = await generateOtp();
    const hashOtp = await Hash(String(otp), Number(process.env.SALT_ROUNDS));

    const user = await this._userModel.createOneUser({
      userName,
      email,
      password: hash,
      age,
      address,
      gender,
      phone,
      otp: hashOtp,
    });

    eventEmitter.emit("confirmEmail", { email, otp });

    return res.status(200).json({ message: "success", user });
  };
  confirmEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp }: confirmEmailSchemaType = req.body;
    const user = await this._userModel.findOne({
      email,
      confirmed: false,
    });
    if (!user) {
      throw new AppError("email not exist or confirmed !");
    }
    console.log(otp, user.otp);
    if (!(await Compare(otp, user?.otp!))) {
      throw new AppError("Invalid otp");
    }
    await this._userModel.updateOne(
      { email: user.email },
      { $set: { confirmed: true }, $unset: { otp: "" } }
    );
    return res.status(200).json({ message: "Confirmed" });
  };


  signIn = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } :signInSchemaType = req.body;

    
    return res.status(200).json({ message: "success" });
  };
}

export default new UserService();
