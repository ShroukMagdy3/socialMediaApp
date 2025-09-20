import { Router } from "express";
import { Authentication } from "../../middleware/authentication";
import PS from "./posts.service";
import { validation } from "../../middleware/validation";
import { createPostSchema, toggleLikeSchema } from "./posts.validation";

const postRouter = Router()

postRouter.post("/createPost" , Authentication() , validation(createPostSchema) ,PS.createPost)
postRouter.get("/AllPosts" , Authentication() , PS.getAllPosts)
postRouter.patch("/toggleLike/:postId" , Authentication(),validation(toggleLikeSchema) , PS.toggleLike)




export default postRouter;