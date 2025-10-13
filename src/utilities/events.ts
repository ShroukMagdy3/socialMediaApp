import { EventEmitter } from "events";
import { generateOtp, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/email.template";
import { deleteFile, getFile } from "./s3.config";
import { UserRepository } from "../DB/Repositories/user.repository";
import userModel, { IUser } from "../DB/models/users.model";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  const { email, otp } = data;
  await sendEmail({
    to: email,
    subject: `Confirm Email`,
    html: emailTemplate(otp as unknown as string, `email confirmation`),
  });
});

eventEmitter.on("forgetPass", async (data) => {
  const { email, otp } = data;
  await sendEmail({
    to: email,
    subject: `forget Password `,
    html: emailTemplate(otp as unknown as string, `forget password`),
  });
});
eventEmitter.on("verifyEmail", async (data) => {
  const { email, otp } = data;
  await sendEmail({
    to: email,
    subject: `verify email `,
    html: emailTemplate(otp as unknown as string, `verify Email`),
  });
});

eventEmitter.on("uploadProfile", async (data) => {
  const { userId, oldKey, Key, expiresIn } = data;
  const _userModel = new UserRepository(userModel);  
  setTimeout( async () => {
    try {
      // if photo uploaded
        await getFile({Key});
      await _userModel.findOneAndUpdate(
        { _id: userId },
        { $unset: { tempProfileImage: "" } }
      );
      // delete old photo
      if (oldKey) {
        await deleteFile(oldKey);
      }
    } catch (error: any) {
      // no photo
      if (error?.Code == "NoSuchKey") {
        if (!oldKey) {
          await _userModel.findOneAndUpdate(
            { _id: userId },
            { $unset: { profileImage: "" } }
          );
        } else {
          await _userModel.findOneAndUpdate(
            { _id: userId },
            { $set: { profileImage: oldKey } },
            { $unset: { tempProfileImage: "" } }
          );
        }
      }
    }
  }, expiresIn * 1000);
});
