import mongoose, { Types } from "mongoose";

export interface IPost {
     _id?: Types.ObjectId;
    postId?:Types.ObjectId
    userId:Types.ObjectId
    content:String
    createdAt?:Date
    updatedAt?:Date
    likes?:Types.ObjectId[]
}



 const PostSchema = new mongoose.Schema<IPost>({
    userId:{type:mongoose.Schema.Types.ObjectId  , ref:"User" , required:true},
    content :{type:String , required:true},
    likes:[{type :mongoose.Schema.Types.ObjectId , ref:"User"}]
 }, {
    timestamps:true
 }) 


 export const PostModel = mongoose.models.Post || mongoose.model( "Post" , PostSchema ) ;

