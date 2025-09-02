"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_service_1 = __importDefault(require("./users.service"));
const validation_1 = require("../../middleware/validation");
const users_validator_1 = require("./users.validator");
const userRouter = (0, express_1.Router)();
userRouter.post("/signUp", (0, validation_1.validation)(users_validator_1.signUpSchema), users_service_1.default.signUp);
userRouter.post("/signIn", users_service_1.default.signIn);
exports.default = userRouter;
