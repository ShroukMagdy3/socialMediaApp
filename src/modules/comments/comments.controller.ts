import { Router } from "express";
import { Authentication } from "../../middleware/authentication";
import { validation } from "../../middleware/validation";
import { MulterCloud, validationFileType } from "../../middleware/multer.cloud";
import CS from "./comments.service";
import { createCommentSchema } from "./comment.validator";

const commentRouter = Router({ mergeParams: true });

commentRouter.post(
  "/",
  Authentication(),
  MulterCloud({ fileTypes: validationFileType.image }).array("attachments"),
  validation(createCommentSchema),
  CS.createComment
);

export default commentRouter;
