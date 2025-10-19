import {  Model } from "mongoose";
import { DbRepository } from "./db.repository";
import { IComment } from "../models/comment.model";

export class CommentRepository extends DbRepository<IComment>{
    constructor(protected readonly model : Model<IComment>){
        super(model)
    }


     
}