import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import { createChat } from "../controllers/chat.controller";
const router = express.Router();

router.post("/new", protectedRoute, createChat);
export default router;
