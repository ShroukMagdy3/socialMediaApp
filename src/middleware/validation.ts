import { safeParse } from "./../../node_modules/zod/src/v4/core/parse";
import { NextFunction, Request, Response } from "express";

import { ZodType } from "zod";
import { AppError } from "../utilities/classError";

type reqType = keyof Request;
type schemaType = Partial<Record<reqType, ZodType>>;


export const validation = (schema: schemaType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let validationError = [];
    for (const key of Object.keys(schema) as reqType[]) {
      if (!schema[key]) continue;

      if(req.file){
        req.body.attachments = req.file
      }
       if(req?.files){
        req.body.attachments = req.files
      }
      const res = schema[key].safeParse(req[key]);
      if (!res.success) {
        validationError.push(res.error);
      }
    }
    if (validationError.length) {
      throw new AppError(JSON.parse(validationError as unknown as string));
    }
    next();
  };
};
