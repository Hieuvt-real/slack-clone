import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const PORT = ENV.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("hello world! 123");
});

app.listen(PORT, () => {
  connectDB();
  console.log(`server started onport ${PORT}`);
});
