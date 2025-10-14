import mongoose, { mongo } from "mongoose"


export enum AvailabilityEnum  {
    friends ="friends",
    private = "private",
    public = "public"
}
export enum AllowCommentEnum  {
    deny ="deny",
    available = "available",
}
export interface IPost {

    content?:string ,
    attachments?:string[]
    assetFolderId?:string,
    createdBy:mongoose.Schema.Types.ObjectId

    tags?:mongoose.Schema.Types.ObjectId
    likes?:mongoose.Schema.Types.ObjectId
    
    allowComment:AllowCommentEnum
    availability:AvailabilityEnum

    deletedAt:Date
    deletedBy:mongoose.Schema.Types.ObjectId

    restoreAt:Date
    restoreBy:mongoose.Schema.Types.ObjectId

}


export const postSchema = new mongoose.Schema<IPost>({
 content:{type:String , minlength:5 , maxlength:10000, required:function(){ return this.attachments?.length === 0 }  } ,
    attachments:[{type:String }],
    assetFolderId :{type:String },
    createdBy:[{type : mongoose.Schema.Types.ObjectId , ref:"User" , required:true}],

    tags:[{type : mongoose.Schema.Types.ObjectId , ref:"User"}],
    likes:[{type : mongoose.Schema.Types.ObjectId , ref:"User"}]   ,

    allowComment:{type:String , enum:AllowCommentEnum , default:AllowCommentEnum.available},
    availability:{type:String , enum:AvailabilityEnum, default:AvailabilityEnum.public },

    deletedAt:{type:Date },
    deletedBy:{type : mongoose.Schema.Types.ObjectId , ref:"User"},

    restoreAt:{type:Date },
    restoreBy:{type : mongoose.Schema.Types.ObjectId , ref:"User"}


} ,{
    timestamps:true , 
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    }
})


const PostModel = mongoose.models.Post || mongoose.model<IPost>("Post" , postSchema);

export default PostModel;