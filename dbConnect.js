import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to ${connection.host} database `);
  } catch (error) {
    console.log(error);
  }
};

export default connect;
