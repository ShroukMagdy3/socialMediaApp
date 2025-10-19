import { HydratedDocument, Model, RootFilterQuery } from "mongoose";
import { IPost } from "../models/post.model";
import { DbRepository } from "./db.repository";
import { AppError } from "../../utilities/classError";

export class PostRepository extends DbRepository<IPost>{
    constructor(protected readonly model : Model<IPost>){
        super(model)
    }


     async createOnePost(data: Partial<IPost>): Promise<HydratedDocument<IPost>> {
        const post :HydratedDocument<IPost> = await this.model.create(data);
        if (!post) {
              throw new AppError("fail to create");
            }
            return post;
    }
  
}