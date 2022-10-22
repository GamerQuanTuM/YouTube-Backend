import { StatusCodes } from "http-status-codes";
import createError from "../middleware/error.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token)
    return next(
      new createError("You are not authenticated", StatusCodes.UNAUTHORIZED)
    );

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return next(new createError("Token Invalid", StatusCodes.FORBIDDEN));
      req.user = user;
      next();
  });
};
