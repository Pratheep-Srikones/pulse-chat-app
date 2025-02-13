import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary";
import { getUserScoketId, io } from "../utils/socket";

export const getOtherUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const currentUserID = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: currentUserID },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching other users", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  const { id: otherUserID } = req.params;
  const currentUserID = req.user._id;
  try {
    const messages = await Message.find({
      $or: [
        { receiverId: currentUserID, senderId: otherUserID },
        { receiverId: otherUserID, senderId: currentUserID },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { text, image } = req.body;
  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  try {
    let imgUrl;
    if (image) {
      const uploadData = await cloudinary.uploader.upload(image);
      imgUrl = uploadData.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imgUrl,
    });

    await newMessage.save();
    const receiverSocketId = getUserScoketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
