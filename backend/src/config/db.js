import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  //  KIỂM TRA TRẠNG THÁI: Nếu đã kết nối (readyState >= 1), thoát ngay lập tức.
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB connection already established.");
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB connected successfully:", conn.connection.host);
  } catch (error) {
    console.error("error connecting to MongoDB:", error);
    throw new Error("MongoDB Connection Failed");
  }
};
