import express from "express";
import { signin, signup, googleAuth } from "../controllers/auth.js";

const router = express.Router();

//Create a new user
router.post("/signup", signup);

//Sign In
router.post("/signin", signin);

//Google Authentication
router.post("/google", googleAuth);

export default router;
