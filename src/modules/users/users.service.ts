import { NextFunction, Request, Response } from "express";
import {
  confirmEmailSchemaType,
  flagType,
  forgetPassSchemaType,
  loginWithGmailSchemaType,
  LogOutSchemaType,
  resetPassSchemaType,
  signInSchemaType,
  signUpSchemaType,
} from "./users.validator";
import userModel, { providerType, roleType } from "../../DB/models/users.model";
import { UserRepository } from "../../DB/Repositories/user.repository";
import { AppError } from "../../utilities/classError";
import { Compare, Hash } from "../../utilities/hash";
import { generateOtp } from "../../service/sendEmail";
import { eventEmitter } from "../../utilities/events";
import { generateToken } from "../../utilities/token";
import { v4 as uuidv4 } from "uuid";
import revokeTokenModel from "../../DB/models/revokeToken.model";
import { revokeTokenRepository } from "../../DB/Repositories/revokeToken.repository";
import { OAuth2Client, TokenPayload } from "google-auth-library";
import { compare } from "bcrypt";

class UserService {
  private _userModel = new UserRepository(userModel);
  private _revokeTokenModel = new revokeTokenRepository(revokeTokenModel);

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
    if (!(await Compare(otp, user?.otp!))) {
      throw new AppError("Invalid otp");
    }
    await this._userModel.updateOne(
      { email: user.email },
      { $set: { confirmed: true }, $unset: { otp: "" } }
    );
    return res.status(200).json({ message: "Confirmed" });
  };

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: signInSchemaType = req.body;
    const user = await this._userModel.findOne({ email , provider:providerType.system });
    if (!user) {
      throw new AppError("this user not found ", 404);
    }
    if (!user.confirmed) {
  throw new AppError("this user is not confirmed", 403);
}
    if (!(await Compare(password, user.password))) {
      throw new AppError("invalid Password", 400);
    }
    const jwtId = uuidv4();
    const accessToken = await generateToken({
      payload: { id: user._id, email },
      signature:
        user.role == roleType.user
          ? process.env.SIGNATURE_access_USER!
          : process.env.SIGNATURE_access_ADMIN!,
      options: {
        expiresIn: 60 * 60,
        jwtid: jwtId,
      },
    });
    const refresh_token = await generateToken({
      payload: { id: user._id, email },
      signature:
        user.role == roleType.admin
          ? process.env.SIGNATURE_REFRESH_ADMIN!
          : process.env.SIGNATURE_REFRESH_USER!,
      options: { expiresIn: "1y", jwtid: jwtId },
    });

    return res
      .status(200)
      .json({ message: "success", accessToken, refresh_token });
  };

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "success", user: req.user });
  };
  LogOut = async (req: Request, res: Response, next: NextFunction) => {
    const { flag }: LogOutSchemaType = req.body;
    if (flag === flagType.all) {
      await this._userModel.updateOne(
        { _id: req.user._id },
        { changeCredentials: new Date() }
      );
      return res
        .status(200)
        .json({ message: "you are log out from all devices" });
    }

    await this._revokeTokenModel.create({
      tokenId: req.decoded.jti!,
      userId: req.user._id,
      expAt: new Date(req.decoded.exp! * 1000),
    });
    return res
      .status(200)
      .json({ message: "you are log out from this device only" });
  };
  refreshToken= async (req: Request, res: Response, next: NextFunction) => {
const jwtId = uuidv4();
    const accessToken = await generateToken({
      payload: { id: req?.user?._id,email : req?.user?.email },
      signature:
        req.user.role == roleType.user
          ? process.env.SIGNATURE_access_USER!
          : process.env.SIGNATURE_access_ADMIN!,
      options: {
        expiresIn: 60 * 60,
        jwtid: jwtId,
      },
    });
    const refresh_token = await generateToken({
      payload: { id: req?.user?._id,email: req?.user?.email },
      signature:
        req?.user?.role == roleType.admin
          ? process.env.SIGNATURE_REFRESH_ADMIN!
          : process.env.SIGNATURE_REFRESH_USER!,
      options: { expiresIn: "1y", jwtid: jwtId },
    });

    await this._revokeTokenModel.create({
      tokenId:req.decoded.jti!,
      userId:req.user._id!,
      expAt:new Date (req?.decoded?.exp! * 1000)
    })


    return res.status(200).json({ message: "success", accessToken , refresh_token });
  };
  loginWithGmail=  async (req: Request, res: Response, next: NextFunction) => {
  const { idToken } :loginWithGmailSchemaType = req.body;
  const client = new OAuth2Client();
  async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });
    const payLoad = ticket.getPayload();
    
    console.log(process.env.GOOGLE_CLIENT_ID);
    
    return payLoad
  }

  const { email, email_verified, name, picture } = await verify() as TokenPayload;
  
  let user = await this._userModel.findOne({ email });
  if(user?.provider == providerType.system){
    throw new AppError(" you must signUp first");
  }
  if (!user) {
    user = await this._userModel.create({
      email : email !,
      userName:name! ,
      confirmed: email_verified!,
      image: picture!,
      provider: providerType.google!,
      password: uuidv4()!,
    });

}
 const jwtId = uuidv4();
    const accessToken = await generateToken({
      payload: { id: user._id, email },
      signature:
        user.role == roleType.user
          ? process.env.SIGNATURE_access_USER!
          : process.env.SIGNATURE_access_ADMIN!,
      options: {
        expiresIn: 60 * 60,
        jwtid: jwtId,
      },
    });
    const refresh_token = await generateToken({
      payload: { id: user._id, email },
      signature:
        user.role == roleType.admin
          ? process.env.SIGNATURE_REFRESH_ADMIN!
          : process.env.SIGNATURE_REFRESH_USER!,
      options: { expiresIn: "1y", jwtid: jwtId },
    });

    return res
      .status(200)
      .json({ message: "success", accessToken, refresh_token });
  }
  forgetPass =async (req: Request, res: Response, next: NextFunction) => {
  
  const {email}:forgetPassSchemaType = req.body;
  const user = await this._userModel.findOne({
    email
  })
  if(!user) {
    throw new AppError("this user not exist or not confirmed yet " , 404);
  }
  const otp = await generateOtp();
  const hashOtp = await Hash( String(otp) );
  eventEmitter.emit("forgetPass" , {email, otp});
  await this._userModel.updateOne({email:user?.email } ,{otp:hashOtp})

return res.status(200).json({message:"success sent otp"})
  }
  resetPass =async (req: Request, res: Response, next: NextFunction) => {
  
  const {email  ,otp, password , cPassword}:resetPassSchemaType = req.body;
  const user = await this._userModel.findOne({
    email
  })
  if(!user) {
    throw new AppError("this user not exist or not confirmed yet " , 404);
  }
  if(!await Compare (otp , user?.otp! )){
    throw new AppError("wrong otp");
  }
  const hashPass =await Hash(password);
  await this._userModel.updateOne({email :email } ,{
    password:hashPass ,
      $unset: {opt : ""}
  })

return res.status(200).json({message:"success "})
  }





}

export default new UserService();
