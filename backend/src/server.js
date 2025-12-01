import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";

const PORT = ENV.PORT;

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
  res.send("hello world! 123");
});

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      app.listen(PORT, () => {
        console.log(`server started onport ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Error strtaing server", error);
    process.exit(1);
  }
};

startServer();

export default app;
