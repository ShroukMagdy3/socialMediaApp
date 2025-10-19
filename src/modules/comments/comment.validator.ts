import z from "zod";
import { generalRules } from "../../utilities/generalRules";
import { OnModelEnum } from "../../DB/models/comment.model";


export const createCommentSchema ={
    params:z.strictObject({
        postId:generalRules.id,
        commentId:generalRules.id.optional(),

    }),
    body:z.strictObject({
        content:z.string().min(5).max(10000).optional(),
        attachments :z.array(generalRules.file).optional(),
        assetFolderId :z.string().optional(),
        onModel:z.enum(OnModelEnum),
        tags:z.array(generalRules.id).refine((value) =>{
            return new Set(value).size === value.length
        } ,{
            message:"duplicate tags"
        }).optional()
    }).superRefine((value , ctx) =>{
        if(!value.content && value.attachments?.length==0){
            ctx.addIssue({
                code:"custom",
                path:["content"],
                message:"content or attachment is required"
            })
        }
    })
}


