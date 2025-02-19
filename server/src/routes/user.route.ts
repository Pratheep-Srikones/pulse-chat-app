import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware";
import { getUserByEmail } from "../controllers/auth.controller";
const router = express.Router();

router.get("/", protectedRoute, getUserByEmail);
export default router;
