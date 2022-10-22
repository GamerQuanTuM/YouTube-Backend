import { StatusCodes } from "http-status-codes";
import createError from "../utils/errorHandler.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const updateUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(updatedUser);
  } else {
    return next(
      new createError(
        "You can update only your account!",
        StatusCodes.FORBIDDEN
      )
    );
  }
};
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    await User.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json("User has been deleted");
  } else {
    return next(
      new createError(
        "You can delete only your account!",
        StatusCodes.FORBIDDEN
      )
    );
  }
};
export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(StatusCodes.OK).json(user);
};

export const subscribe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $push: { subscribedUsers: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $inc: { subscribers: 1 },
  });
  res.status(StatusCodes.OK).json("Subscription successful");
};

export const unsubscribe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { subscribedUsers: req.params.id },
  });
  await User.findByIdAndUpdate(req.params.id, {
    $inc: { subscribers: -1 },
  });
  res.status(StatusCodes.OK).json("Unsubscription successful");
};

export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { likes: id },
    $pull: { dislikes: id },
  });
  res.status(StatusCodes.OK).json("Video has been liked");
};
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  await Video.findByIdAndUpdate(videoId, {
    $addToSet: { dislikes: id },
    $pull: { likes: id },
  });
  res.status(StatusCodes.OK).json("Video has been disliked");
};
