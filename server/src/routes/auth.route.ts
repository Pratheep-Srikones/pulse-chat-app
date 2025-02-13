import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateBio,
  updateProfile,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectedRoute, updateProfile);
router.put("/update-bio", protectedRoute, updateBio);
router.get("/check", protectedRoute, checkAuth);
export default router;
