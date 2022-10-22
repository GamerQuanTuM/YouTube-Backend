import { StatusCodes } from "http-status-codes";
import createError from "../utils/errorHandler.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  const savedComment = await newComment.save();
  res.status(StatusCodes.OK).json(savedComment);
};
export const deleteComment = async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  const video = await Video.findById(req.params.id);
  if (req.user.id === comment.userId || req.user.id === video.userId) {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json("The comment has been deleted");
  } else {
    return next(
      new createError(
        "You can delete only your comment!",
        StatusCodes.FORBIDDEN
      )
    );
  }
};
export const getComment = async (req, res, next) => {
  const comments = await Comment.find({ videoId: req.params.videoId });
  res.status(StatusCodes.OK).json(comments);
};
