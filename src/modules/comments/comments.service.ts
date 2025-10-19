import { IComment, OnModelEnum } from "./../../DB/models/comment.model";
import { NextFunction, Response, Request } from "express";
import { UserRepository } from "../../DB/Repositories/user.repository";
import userModel from "../../DB/models/users.model";
import { PostRepository } from "../../DB/Repositories/posts.repository";
import PostModel, {
  AllowCommentEnum,
  AvailabilityEnum,
  IPost,
} from "../../DB/models/post.model";
import CommentModel from "../../DB/models/comment.model";
import { CommentRepository } from "../../DB/Repositories/comment.repository";
import { deleteFiles, uploadFiles } from "../../utilities/s3.config";
import { AppError } from "../../utilities/classError";
import { v4 as uuidv4 } from "uuid";
import { HydratedDocument, Types } from "mongoose";

class CommentService {
  private _userModel = new UserRepository(userModel);
  private _postModel = new PostRepository(PostModel);
  private _commentModel = new CommentRepository(CommentModel);
  constructor() {}

 createComment = async (req: Request, res: Response, next: NextFunction) => {
  const { postId, commentId } = req.params;
  let { content, attachments = [], tags = [], onModel } = req.body;

  let doc: HydratedDocument<IPost | IComment> | null = null;

  if (commentId && onModel === OnModelEnum.Comment) {
    const comment = await this._commentModel.findOne({
      _id: commentId,
      refId:postId, 
    });

    if (!comment) {
      throw new AppError("This comment not found or unauthorized");
    }

    doc = comment;
  }

  else if (onModel === OnModelEnum.Post) {
    const post = await this._postModel.findOne({
      _id: new Types.ObjectId(postId),
      allowComment: AllowCommentEnum.allow,
      $or: [
        { availability: AvailabilityEnum.public },
        {
          $and: [
            { availability: AvailabilityEnum.friends },
            { createdBy: { $in: req.user.friends } },
          ],
        },
      ],
    });

    if (!post) {
      throw new AppError("This post not found or unauthorized");
    }

    doc = post;
  }
  if (
      req.body?.tags?.length &&
      (await this._userModel.find({filter:{ _id: { $in: req.body.tags }} })).length !==
        req.body.tags.length
    ) {
      throw new AppError("invalid Tags ID");
    }
  const assetFolderId = uuidv4();
  if (req.files && (req.files as Express.Multer.File[]).length > 0) {
    attachments = await uploadFiles({
      path: `users/${req.user._id}/posts/${doc?.assetFolderId}/comments/${assetFolderId}`,
      files: req.files as unknown as Express.Multer.File[],
    });
    
  }

  const comment = await this._commentModel.create({
    content,
    tags,
    attachments,
    assetFolderId,
    refId: doc?._id as Types.ObjectId,
    onModel,
    createdBy: req.user._id,
  });

  if (!comment) {
    await deleteFiles({ urls: attachments });
    throw new AppError("Failed to create comment");
  }
  console.log(comment);
  

  return res.status(201).json({ message: "Created", comment });
};

}

export default new CommentService();
