"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)({ path: (0, path_1.resolve)("./config/.env") });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const classError_1 = require("./utilities/classError");
const users_controller_1 = __importDefault(require("./modules/users/users.controller"));
const connectionDB_1 = require("./DB/connectionDB");
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const limiter = (0, express_rate_limit_1.default)({
    max: 10,
    windowMs: 5 * 60 * 1000,
    message: {
        error: "too many requests",
    },
    statusCode: 429,
    legacyHeaders: false,
});
const bootstrap = async () => {
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(limiter);
    app.use("/api/user", users_controller_1.default);
    app.get("/", (req, res, next) => {
        return res.status(200).json({ message: "welcome to my socialApp" });
    });
    await (0, connectionDB_1.connectionDB)();
    app.use("{/*demo}", (req, res, next) => {
        throw new classError_1.AppError(`Invalid URL ${req.originalUrl}`, 404);
    });
    app.use((err, req, res, next) => {
        return res.status(err.cause || 500).json({ message: err.message, stack: err.stack });
    });
    app.listen(port, () => {
        console.log(`server is running on ${port}`);
    });
};
exports.default = bootstrap;
