import { EventEmitter } from "events";
import { generateOtp, sendEmail } from "../service/sendEmail";
import { emailTemplate } from "../service/email.template";

export const eventEmitter = new EventEmitter();

eventEmitter.on("confirmEmail", async (data) => {
  const { email , otp } = data;
  await sendEmail({
    to: email,
    subject: `Confirm Email`,
    html: emailTemplate(otp as unknown as string, `email confirmation`),
  });
});
