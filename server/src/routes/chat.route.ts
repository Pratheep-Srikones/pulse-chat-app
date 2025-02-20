import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import {
  createChat,
  getChats,
  getPersonalChats,
  markAsRead,
} from "../controllers/chat.controller";
const router = express.Router();
router.get("/", protectedRoute, getChats);
router.get("/private", protectedRoute, getPersonalChats);
router.post("/new", protectedRoute, createChat);
router.post("/mark-as-read", protectedRoute, markAsRead);
export default router;
