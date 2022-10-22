import Video from "../models/Video.js";
import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import createError from "../utils/errorHandler.js";

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  const savedVideo = await newVideo.save();
  res.status(StatusCodes.CREATED).json(savedVideo);
};

export const updateVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video)
    return next(new createError("Video not found", StatusCodes.NOT_FOUND));
  if (req.user.id === video.userId) {
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(StatusCodes.OK).json(updatedVideo);
  } else {
    return next(
      new createError("You can update your own videos", StatusCodes.FORBIDDEN)
    );
  }
};

export const deleteVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  if (!video)
    return next(new createError("Video not found", StatusCodes.NOT_FOUND));
  if (req.user.id === video.userId) {
    await Video.findByIdAndDelete(req.params.id);
    res.status(StatusCodes.OK).json("Video deleted successfully");
  } else {
    return next(
      new createError("You can delete your own videos", StatusCodes.FORBIDDEN)
    );
  }
};

export const getVideo = async (req, res, next) => {
  const video = await Video.findById(req.params.id);
  res.status(StatusCodes.OK).json(video);
};

export const addView = async (req, res, next) => {
  await Video.findByIdAndUpdate(req.params.id, {
    $inc: { views: 1 },
  });
  res.status(StatusCodes.OK).json("The view has been increased");
};
export const random = async (req, res, next) => {
  const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
  res.status(StatusCodes.OK).json(videos);
};

export const trend = async (req, res, next) => {
  const videos = await Video.find().sort({ views: -1 });
  res.status(StatusCodes.OK).json(videos);
};
export const sub = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const subscribedChannels = user.subscribedUsers;
  const list = await Promise.all(
    subscribedChannels.map((ChannelId) => {
      return Video.find({ userId: ChannelId });
    })
  );
  res
    .status(StatusCodes.OK)
    .json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
};

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(",");
  const videos = await Video.find({ tags: { $in: tags } }).limit(20);
  res.status(StatusCodes.OK).json(videos);
};

export const search = async (req, res, next) => {
  const query = req.query.q;
  const videos = await Video.find({
    title: { $regex: query, $options: "i" },
  }).limit(40);
  res.status(StatusCodes.OK).json(videos);
};
