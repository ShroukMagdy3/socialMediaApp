"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventEmitter = void 0;
const events_1 = require("events");
const sendEmail_1 = require("../service/sendEmail");
const email_template_1 = require("../service/email.template");
exports.eventEmitter = new events_1.EventEmitter();
exports.eventEmitter.on("confirmEmail", async (data) => {
    const { email, otp } = data;
    await (0, sendEmail_1.sendEmail)({
        to: email,
        subject: `Confirm Email`,
        html: (0, email_template_1.emailTemplate)(otp, `email confirmation`),
    });
});
