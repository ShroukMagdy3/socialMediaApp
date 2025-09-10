import { Model } from "mongoose";
import { IRevokeToken } from "../models/revokeToken.model";
import { DbRepository } from "./db.repository";

export class revokeTokenRepository extends DbRepository<IRevokeToken>{
    constructor(protected readonly model : Model<IRevokeToken> ){
        super(model)
    }

}