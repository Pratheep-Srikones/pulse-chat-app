import { Response, Request } from "express";
import User from "../models/user.model";
import { hashPassword } from "../utils/password";
import { generateJWTToken } from "../utils/jwt";

export const signup = async (req: Request, res: Response) => {
  try {
    const { full_name, email, password, bio, profile_pic_url } = req.body;

    if (!full_name || !email || !password) {
      res.status(400).json({ message: "Please enter all fields" });
      return;
    }

    if (typeof password !== "string" || password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already used" });
      return;
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      full_name,
      email,
      password: hashedPassword,
      bio,
      profile_pic_url,
    });

    await newUser.save();
    generateJWTToken(newUser._id.toString(), res);

    res.status(201).json({
      _id: newUser._id,
      full_name: newUser.full_name,
      email: newUser.email,
      bio: newUser.bio,
      profile_pic_url: newUser.profile_pic_url,
      message: "User created",
    });
  } catch (error) {
    console.error("Error in Signup", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = (req: Request, res: Response) => {
  res.send("Login");
};

export const logout = (req: Request, res: Response) => {
  res.send("Logout");
};
