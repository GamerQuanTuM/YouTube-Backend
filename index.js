//https://github.com/safak/youtube2022/tree/fullstack-youtube-clone
import express from "express";
import "express-async-errors";
import connect from "./dbConnect.js";
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";

//Routes exports
import authRoute from "./routes/auth.js";
import commentRoute from "./routes/comments.js";
import userRoute from "./routes/users.js";
import videoRoute from "./routes/videos.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middleware/error.js";

const app = express();

app.use(cors());

//Port
const port = process.env.PORT || 8800;

//Middlewares
app.use(cookieParser());
app.use(express.json());

//Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/videos", videoRoute);
app.use("/api/comments", commentRoute);

app.get("/",(req,res)=>{
  res.send("YouTube API")
})


app.listen(port, () => {
  connect();
  console.log(`Server listening on port http://localhost:${port}/`);
});

app.use(errorMiddleware);
