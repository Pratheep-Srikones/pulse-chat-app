import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.config";
import User from "../models/user.model";
import { Request as ExpressRequest } from "express"; // Alias to avoid confusion

// Extend Express Request to include user property
export interface AuthenticatedRequest extends ExpressRequest {
  user?: any; // You can use a User type if you have one
}

export const protectedRoute = async (
  req: AuthenticatedRequest, // Use extended Request
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ message: "Unauthorized - Token not found" });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as jwt.JwtPayload;

    if (!decoded || !decoded.userId) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({ message: "Unauthorized - User not found" });
      return;
    }

    req.user = user; // TypeScript will now recognize `req.user`
    next();
  } catch (error) {
    console.error("Error in protected route:", error);

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Unauthorized - Invalid Token" });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Unauthorized - Token Expired" });
      return;
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};
