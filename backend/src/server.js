import express from "express";
import { ENV } from "./config/env.js";

const PORT = ENV.PORT;
const app = express();

app.get("/", (req, res) => {
  res.send("hello world! 123");
});

app.listen(PORT, () => console.log(`server started onport ${PORT}`));
