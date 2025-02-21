import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../utils/cloudinary";
import { getUserScoketId, io } from "../utils/socket";
import Chat from "../models/chat.model";

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
  const { chatId } = req.query;
  try {
    const messages = await Message.find({
      chatId,
    })
      .sort({ createdAt: 1 })
      .populate("senderId", "full_name profile_pic_url");

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  const { text, image } = req.body;
  const { id: chatId } = req.params;
  const senderId = req.user._id;

  const participants = await Chat.findOne({ _id: chatId }).select(
    "participants unreadCounts"
  );
  if (!participants) {
    res.status(404).json({ message: "Chat not found" });
    return;
  }

  try {
    let imgUrl;
    if (image) {
      const uploadData = await cloudinary.uploader.upload(image);
      imgUrl = uploadData.secure_url;
    }

    const newMessage = new Message({
      senderId,
      chatId,
      text,
      image: imgUrl,
      readBy: [senderId],
    });
    const savedMessage = await newMessage.save();
    const populatedMessage = await savedMessage.populate(
      "senderId",
      "full_name profile_pic_url"
    );

    // Ensure unreadCounts map exists before updating
    const chat = await Chat.findById(newMessage.chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    if (!chat.unreadCounts) {
      chat.unreadCounts = new Map();
    }

    if (!chat.unreadCounts.has(senderId.toString())) {
      chat.unreadCounts.set(senderId.toString(), 0);
    }

    await Chat.findByIdAndUpdate(newMessage.chatId, {
      $set: { lastMessage: newMessage._id },
      $setOnInsert: { [`unreadCounts.${senderId.toString()}`]: 0 },
    });

    if (participants.participants.length > 1) {
      participants.participants.forEach(async (receiverId) => {
        const receiverSocketId = getUserScoketId(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }
        if (receiverId.toString() !== senderId.toString()) {
          if (!chat.unreadCounts.has(receiverId.toString())) {
            await Chat.findByIdAndUpdate(newMessage.chatId, {
              $set: { [`unreadCounts.${receiverId.toString()}`]: 0 },
            });
          }
          await Chat.findByIdAndUpdate(newMessage.chatId, {
            $inc: { [`unreadCounts.${receiverId.toString()}`]: 1 },
          });
        }
      });
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
