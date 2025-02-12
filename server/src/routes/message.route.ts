import express from "express";
import { getMessages, getOtherUsers } from "../controllers/message.controller";
import { protectedRoute } from "../middlewares/auth.middleware";
const router = express.Router();

router.get("/users", protectedRoute, getOtherUsers);
router.get("/:id", protectedRoute, getMessages);
export default router;
