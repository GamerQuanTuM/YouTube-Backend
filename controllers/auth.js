import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import createError from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.password, salt);
  const newUser = new User({ ...req.body, password: hash });

  await newUser.save();
  res.status(StatusCodes.CREATED).send("User has been created!");
};

export const signin = async (req, res, next) => {
  const user = await User.findOne({ name: req.body.name });
  if (!user)
    return next(new createError("User not found!", StatusCodes.NOT_FOUND));

  const isCorrect = await bcrypt.compare(req.body.password, user.password);

  if (!isCorrect)
    return next(new createError("Wrong Credentials!", StatusCodes.BAD_REQUEST));

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  const { password, ...otherDetails } = user._doc;
  res
    .cookie("access_token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
    })
    .status(StatusCodes.OK)
    .json(otherDetails);
};

export const googleAuth = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(StatusCodes.OK)
      .json(user._doc);
  } else {
    const newUser = new User({
      ...req.body,
      fromGoogle: true,
    });
    const savedUser = newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      })
      .status(StatusCodes.OK)
      .json(savedUser._doc);
  }
};
