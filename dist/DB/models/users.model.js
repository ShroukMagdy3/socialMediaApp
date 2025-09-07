"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleType = exports.genderType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var genderType;
(function (genderType) {
    genderType["male"] = "male";
    genderType["female"] = "female";
})(genderType || (exports.genderType = genderType = {}));
var roleType;
(function (roleType) {
    roleType["user"] = "user";
    roleType["admin"] = "admin";
})(roleType || (exports.roleType = roleType = {}));
const userSchema = new mongoose_1.default.Schema({
    fName: { type: String, minLength: 2, maxlength: 10, trim: true },
    lName: { type: String, minLength: 2, maxlength: 10, trim: true },
    email: { type: String, unique: true, trim: true },
    gender: {
        type: String,
        enum: genderType,
        required: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    age: { type: Number, min: 18, max: 60, required: true },
    role: { type: String, enum: roleType, default: roleType.user },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
userSchema
    .virtual("userName")
    .set(function (val) {
    const [fName, lName] = val.split(" ");
    this.set({ fName, lName });
})
    .get(function () {
    return this.fName + " " + this.lName;
});
const userModel = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
exports.default = userModel;
