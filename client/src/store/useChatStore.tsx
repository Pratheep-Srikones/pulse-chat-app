/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { toastError } from "../utils/notify";

import axiosInstance from "../utils/axios";
import { AuthUser } from "./useAuthStore";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
interface ChatState {
  messages: Message[];
  users: AuthUser["user"][];

  selectedUser: AuthUser["user"] | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (text: string, image: string) => Promise<void>;
  setSelectedUser: (user: AuthUser["user"] | null) => void;
}
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],

  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toastError("Error fetching users");
      console.error("Error fetching users", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toastError("Error fetching messages");
      console.error("Error fetching messages", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (text: string, image: string) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        {
          text,
          image,
        }
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toastError("Error sending message");
      console.error("Error sending message", error);
    }
  },
  setSelectedUser: (user: AuthUser["user"] | null) =>
    set({ selectedUser: user }),
}));
