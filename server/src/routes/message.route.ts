import express from "express";
import {
  getMessages,
  getOtherUsers,
  sendMessage,
} from "../controllers/message.controller";
import { protectedRoute } from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/users", protectedRoute, getOtherUsers);
router.get("/", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
export default router;
