"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signUpSchema = {
    body: zod_1.default
        .object({
        userName: zod_1.default.string().min(2).max(10),
        password: zod_1.default
            .string()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
        email: zod_1.default.string().email(),
        cPassword: zod_1.default.string(),
        age: zod_1.default.number(),
        address: zod_1.default.string(),
        phone: zod_1.default.string(),
        gender: zod_1.default.string()
    })
        .required()
        .superRefine((data, context) => {
        if (data.password !== data.cPassword) {
            context.addIssue({
                code: "custom",
                path: ["cPassword"],
            });
        }
    }),
};
