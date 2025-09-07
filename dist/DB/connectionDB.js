"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectionDB = () => {
    mongoose_1.default
        .connect(process.env.LINKDB)
        .then(() => {
        console.log(`successful connection to DB`);
    })
        .catch((err) => {
        console.log(`error in connection to DB ${err}`);
    });
};
exports.connectionDB = connectionDB;
