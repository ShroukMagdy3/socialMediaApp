import { Router } from "express";
import { Authentication } from "../../middleware/authentication";
import { validation } from "../../middleware/validation";
import { createPostSchema, likePostSchema, updateSchema } from "./posts.validator";
import PS from "./posts.service";
import { MulterCloud, validationFileType } from "../../middleware/multer.cloud";
import commentRouter from "../comments/comments.controller";

 const postRouter = Router({mergeParams:true})
 postRouter.use("/:postId/comment{/:commentId/reply}" , commentRouter)

 postRouter.post("/createPost"  ,
    Authentication() ,
    MulterCloud({fileTypes:validationFileType.image}).array("attachments" , 2), 
    validation(createPostSchema) , PS.createPost )

    postRouter.patch("/react/:postId",Authentication() ,validation(likePostSchema) , PS.likePost)
    postRouter.patch("/update/:postId",Authentication() ,
    MulterCloud({fileTypes:validationFileType.image}).array("attachments" , 2)  
    ,validation(updateSchema) , PS.updatePost)


    postRouter.get("/getAllPosts" ,
       Authentication(),
        PS.getAllPost)
 

 export default postRouter;