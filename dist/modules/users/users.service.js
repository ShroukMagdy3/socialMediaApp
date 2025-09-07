"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../../DB/models/users.model"));
const user_repository_1 = require("../../DB/Repositories/user.repository");
const classError_1 = require("../../utilities/classError");
const hash_1 = require("../../utilities/hash");
const events_1 = require("../../utilities/events");
class UserService {
    _userModel = new user_repository_1.UserRepository(users_model_1.default);
    signUp = async (req, res, next) => {
        const { userName, email, password, age, gender, address, phone, } = req.body;
        if ((await this._userModel.findOne({ email }))) {
            throw new classError_1.AppError("email is already exist");
        }
        const hash = await (0, hash_1.Hash)(password);
        const user = await this._userModel.createOneUser({
            userName,
            email,
            password: hash,
            age,
            address,
            gender,
            phone,
        });
        events_1.eventEmitter.emit("confirmEmail", { email });
        return res.status(200).json({ message: "success", user });
    };
    signIn = (req, res, next) => {
        const { email, password } = req.body;
        return res.status(200).json({ message: "success" });
    };
}
exports.default = new UserService();
