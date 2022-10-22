import express from "express";
import {
  addVideo,
  updateVideo,
  deleteVideo,
  getVideo,
  addView,
  trend,
  random,
  sub,
  getByTag,
  search,
} from "../controllers/video.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//Create a video
router.post("/", verifyToken, addVideo);

//Update a video
router.put("/:id", verifyToken, updateVideo);

//Delete a video
router.delete("/:id", verifyToken, deleteVideo);

//Get all video
router.get("/find/:id", getVideo);

//Increase views
router.put("/view/:id", addView);

//Trend Videos
router.get("/trend", trend);

//HomePage Random Videos
router.get("/random", random);

//Subscribed Channel videos
router.get("/sub", verifyToken, sub);

//Get Video by Tags
router.get("/tags", getByTag);

//Search Videos by title
router.get("/search", search);

export default router;
