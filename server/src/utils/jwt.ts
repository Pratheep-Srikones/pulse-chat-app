import { Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env.config";

const jwtSecret = config.jwtSecret;
export const generateJWTToken = (userId: any, res: Response) => {
  const token = jwt.sign({ userId }, jwtSecret);

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: config.nodeEnv !== "development",
  });

  return token;
};
