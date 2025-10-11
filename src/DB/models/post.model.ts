// import mongoose, { Schema, Types } from "mongoose";

// export enum allowCommentEnum {
//    allow ="allow" , 
//    deny ="deny"
// }
// export enum availabilityEnum {
//    private ="private" , 
//    friends ="friends",
//    public ="public"
// }
// export interface IPost {
//      _id?: Types.ObjectId;

//     postId?:Types.ObjectId
//     userId:Types.ObjectId
//     content?:String
//     attachments:String[]
//     createdAt?:Date
//     updatedAt?:Date
//     createdBy:Types.ObjectId,
//     likes?:Types.ObjectId[]
//     tags?:Types.ObjectId[]
//     restoreAt:Date,
//     assetFolderId: String
//     allowComment:String
//     availability:String
//     deletedAt:Date
//     deletedBy:Schema.Types.ObjectId
//     restoreBy:Schema.Types.ObjectId
// }



//  const PostSchema = new Schema<IPost>({
//     userId:{type:Schema.Types.ObjectId  , ref:"User" , required:true},

//     content :{type:String ,minlength:5 , maxLength:10000, required:true},
//     attachments:[String],
//     assetFolderId :String,
//     createdBy:{type:Schema.Types.ObjectId , ref:'User' , required:true},

//     tags :[{type :mongoose.Schema.Types.ObjectId , ref:"User"}],
//     likes:[{type :mongoose.Schema.Types.ObjectId , ref:"User"}],

//     allowComment:{type:String, default:allowCommentEnum.allow},
//     availability:{
//       type:availabilityEnum , default:availabilityEnum.public
//     },
//     deletedAt:{type:Date} ,
//     deletedBy :{type:Schema.Types.ObjectId, ref:'User'},
//     restoreAt:{type:Date},
//     restoreBy:{type:Schema.Types.ObjectId , ref:'User'},


//  }, {
//     timestamps:true,
//     toJSON:{
//       virtuals:true,
//     },
//     toObject:{
//       virtuals:true
//     }
//  }) 


//  export const PostModel = mongoose.models.Post || mongoose.model( "Post" , PostSchema ) ;

