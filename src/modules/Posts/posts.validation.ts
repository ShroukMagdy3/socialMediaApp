import z from "zod";

export const createPostSchema ={
    body:z.strictObject({
        content:z.string().min(2)
    }).required()
}
export const toggleLikeSchema ={
    params:z.strictObject({
        postId:z.string()
    }).required()
}




export type createPostSchemaType = z.infer<typeof createPostSchema.body>
export type toggleLikeSchemaType = z.infer<typeof toggleLikeSchema.params>