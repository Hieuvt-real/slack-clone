// import "../instrument.mjs";
import express from "express";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { clerkMiddleware } from "@clerk/express";
import { functions, inngest } from "./config/inngest.js";
import { serve } from "inngest/express";
import chatRouters from "./routes/chat.route.js";
import * as Sentry from "@sentry/node";

const PORT = ENV.PORT;

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

// api
app.get("/debug-sentry", (req, res) => {
  throw new Error("My first Sentry error!");
});
app.get("/", (req, res) => {
  res.send("hello world! 12");
});
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRouters);

Sentry.setupExpressErrorHandler(app);

const startServer = async () => {
  try {
    await connectDB();
    if (ENV.NODE_ENV !== "production") {
      await import("../instrument.mjs");
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
