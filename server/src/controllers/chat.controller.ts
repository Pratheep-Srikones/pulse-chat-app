import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import Chat from "../models/chat.model";
import Message from "../models/message.model";

export const getChats = async (req: AuthenticatedRequest, res: Response) => {
  const currentUserID = req.user._id;
  try {
    const chats = await Chat.find({ participants: currentUserID })
      .populate("participants")
      .select("-password")
      .populate("lastMessage");

    res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching chats: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createChat = async (req: AuthenticatedRequest, res: Response) => {
  const { participants, name } = req.body;
  const currentUserID = req.user._id;
  if (!participants) {
    res.status(400).json({ message: "Participants are required" });
    return;
  }
  let type = "private";
  let chat_name = name;
  if (participants.length > 2) {
    type = "group";
    chat_name = name || "Group Chat";
  }
  try {
    const chat = await Chat.findOne({ participants });
    if (chat) {
      res.status(400).json({ chat, message: "Chat already exists" });
      return;
    }
  } catch (error) {
    console.error("Error checking chat: ", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
  try {
    const chat = new Chat({
      participants,
      type,
      name: chat_name,
      adminId: currentUserID,
    });
    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error creating chat: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addParticipant = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id: chatId } = req.params;
  const { participantId } = req.body;
  const currentUserID = req.user._id;
  if (!participantId) {
    res.status(400).json({ message: "Participant ID is required" });
    return;
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    if (chat.adminId!.toString() !== currentUserID.toString()) {
      res.status(403).json({ message: "You are not the admin of this chat" });
      return;
    }
    if (chat.participants.includes(participantId)) {
      res.status(400).json({ message: "Participant already exists" });
      return;
    }
    if (chat.type === "private") {
      res
        .status(400)
        .json({ message: "Cannot add more participants to private chat" });
      return;
    }
    chat.participants.push(participantId);
    await chat.save();
    res.status(200).json({ chat, message: "Participant added successfully" });
  } catch (error) {
    console.error("Error adding participant: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeParticipant = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id: chatId } = req.params;
  const { participantId } = req.body;
  const currentUserID = req.user._id;
  if (!participantId) {
    res.status(400).json({ message: "Participant ID is required" });
    return;
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    if (chat.adminId!.toString() !== currentUserID.toString()) {
      res.status(403).json({ message: "You are not the admin of this chat" });
      return;
    }
    if (!chat.participants.includes(participantId)) {
      res.status(400).json({ message: "Participant does not exist" });
      return;
    }
    if (chat.type === "private") {
      res
        .status(400)
        .json({ message: "Cannot remove participants from private chat" });
      return;
    }
    chat.participants = chat.participants.filter(
      (id) => id.toString() !== participantId
    );
    await chat.save();
    res.status(200).json({ chat, message: "Participant removed successfully" });
  } catch (error) {
    console.error("Error removing participant: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
