import z from "zod";
import { AllowCommentEnum, AvailabilityEnum } from "../../DB/models/post.model";
import { generalRules } from "../../utilities/generalRules";


export enum actionEnum {
    like = "like" ,
    unlike ="unlike"
}
export const createPostSchema ={
    body:z.strictObject({
        content:z.string().min(5).max(10000).optional(),
        attachments :z.array(generalRules.file).min(2).optional(),
        assetFolderId :z.string().optional(),

        AllowComment:z.enum(AllowCommentEnum).default(AllowCommentEnum.allow).optional(),
        Availability:z.enum(AvailabilityEnum).default(AvailabilityEnum.public).optional(),

        // not allowed to duplicate mention
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
                message:"content is empty"
            })
        }
    })
}

export const likePostSchema ={
    params :z.strictObject({
        postId:generalRules.id
    }).required(),
    query:z.strictObject({
        action:z.enum(actionEnum).default(actionEnum.like)
    }).required()
}

export const updateSchema ={
    body:z.strictObject({
        content:z.string().min(5).max(10000).optional(),
        attachments :z.array(z.any()).min(2).optional(),
        assetFolderId :z.string().optional(),

        AllowComment:z.enum(AllowCommentEnum).default(AllowCommentEnum.allow).optional(),
        Availability:z.enum(AvailabilityEnum).default(AvailabilityEnum.public).optional(),

        // not allowed to duplicate mention
        tags:z.array(generalRules.id).refine((value) =>{
            return new Set(value).size === value.length
        } ,{
            message:"duplicate tags"
        }).optional()
    }).superRefine((value , ctx) =>{
        if(!Object.values(value).length ){
            ctx.addIssue({
                code:"custom",
                message:"at least one field is required"
            })
        }
    })
}


export type likePostSchemaType = z.infer<typeof likePostSchema.params>;
export type updateSchemaType = z.infer<typeof updateSchema.body>;
