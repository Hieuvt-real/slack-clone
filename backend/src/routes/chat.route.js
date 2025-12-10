import express from "express";
import { getStreamToken } from "../controllers/chat.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const chatRouters = express.Router();

chatRouters.get("/token", protectRoute, getStreamToken);

export default chatRouters;
