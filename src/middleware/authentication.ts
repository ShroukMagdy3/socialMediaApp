import { Request, Response, NextFunction } from "express";
import { AppError } from "../utilities/classError";
import { decodedTokenAndFetch, getSignature, TokenType, verifyToken } from "../utilities/token";
import { revokeTokenRepository } from "../DB/Repositories/revokeToken.repository";
import revokeTokenModel from "../DB/models/revokeToken.model";

  const _revokeTokenModel = new revokeTokenRepository(revokeTokenModel);
export const Authentication = (tokenType :TokenType = TokenType.access) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    const [prefix, token] = authorization?.split(" ") || [];
    if (!prefix || !token) {
      throw new AppError("invalid token", 401);
    }
    const signature = await getSignature(TokenType.access, prefix);
    if (!signature) {
      throw new AppError("invalid signature", 401);
    }

    const decoded = await decodedTokenAndFetch(token , signature);
    
    if(!decoded){
        throw new AppError("invalid token" , 401);
    }

    req.user = decoded?.user
    req.decoded = decoded?.decoded;
   


    return next();
  };
};
