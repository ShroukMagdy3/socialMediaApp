import { NextFunction, Request, Response } from "express";
import { PostModel } from "../../DB/models/post.model"
import { PostRepository } from "../../DB/Repositories/posts.repository"
import { createPostSchemaType, toggleLikeSchemaType } from "./posts.validation";
import { AppError } from "../../utilities/classError";
import { Types } from "mongoose";


class PostService {
    private _postModel = new PostRepository(PostModel)


    createPost = async  (req: Request, res: Response, next: NextFunction) => {
        const {content }:createPostSchemaType = req.body;
        const post = await this._postModel.createOnePost({content:content ,userId :req.user._id  })
        return res.status(201).json({ message: "Created", post });
      };
      getAllPosts =async  (req: Request, res: Response, next: NextFunction) => {
        const post = await this._postModel.findAll()
        return res.status(200).json({ message: "success", post });
      };
      toggleLike =async  (req: Request, res: Response, next: NextFunction) => {
        const {postId}  = req.params as toggleLikeSchemaType;
        const { id } = req.user
        const post = await this._postModel.findOne({_id :new Types.ObjectId(postId)});
        if(!post){
          throw new AppError("this post not found", 404)
        }
        const isLiked = post.likes!.some((d)=>{
          return d.toString() == id.toString()
        })
        if(!isLiked){
           post.likes!.push(id)
           await post.save();
           return res.status(200).json({message:"like this Post" })
        }else{
            post.likes = post.likes!.filter((d:Types.ObjectId) =>{
            return d.toString() !== id.toString();
          })
           await post.save();
           return res.status(200).json({message:"Unlike this Post" })
        }
      };



}




export default new PostService();