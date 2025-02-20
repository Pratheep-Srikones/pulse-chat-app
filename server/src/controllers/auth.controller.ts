import { Response, Request } from "express";
import User from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/password";
import { generateJWTToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import cloudinary from "../utils/cloudinary";

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
    generateJWTToken(newUser._id, res);

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Please enter all fields" });
    return;
  }
  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    generateJWTToken(user._id, res);

    res.json({
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      bio: user.bio,
      profile_pic_url: user.profile_pic_url,
      message: "User logged in",
    });
  } catch (error) {
    console.error("Error in Login", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req: Request, res: Response) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out" });
  } catch (error) {
    console.error("Error in Logout", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user._id;
    const { profilePic } = req.body; // Expect Base64 string

    if (!profilePic) {
      res.status(400).json({ message: "No profile picture provided" });
      return;
    }

    // Upload Base64 image directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pictures",
    });

    // Update user's profile picture URL in database
    const updatedUserPic = await User.findByIdAndUpdate(
      userId,
      { profile_pic_url: uploadResult.secure_url },
      { new: true }
    );

    if (!updatedUserPic) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      updatedUser: updatedUserPic,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateBio = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user._id;
  const { bio } = req.body;

  try {
    const updatedUserBio = await User.findByIdAndUpdate(userId, { bio });

    if (!updatedUserBio) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({
      updatedUser: updatedUserBio,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating bio:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    res.json({
      user,
    });
  } catch (error) {
    console.error("Error in Check Auth", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};

export const getUserByEmail = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { email } = req.query;
  console.log("Email:", email);
  try {
    const user = await User.findOne({ email }).select("-password");
    console.log("User found:", user);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error finding User: ", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
};
