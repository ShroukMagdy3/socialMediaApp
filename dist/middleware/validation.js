"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const classError_1 = require("../utilities/classError");
const validation = (schema) => {
    return (req, res, next) => {
        let validationError = [];
        for (const key of Object.keys(schema)) {
            if (!schema[key])
                continue;
            const res = schema[key].safeParse(req[key]);
            if (!res.success) {
                validationError.push(res.error);
            }
        }
        if (validationError.length) {
            throw new classError_1.AppError(JSON.parse(validationError));
        }
        next();
    };
};
exports.validation = validation;
