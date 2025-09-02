"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserService {
    signUp = (req, res, next) => {
        const { name, email, password, cPassword } = req.body;
        return res.status(200).json({ message: "success" });
    };
    signIn = (req, res, next) => {
        const { email, password } = req.body;
        return res.status(200).json({ message: "success" });
    };
}
exports.default = new UserService;
