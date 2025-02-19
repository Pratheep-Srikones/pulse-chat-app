import { create } from "zustand";
import { toastError } from "../utils/notify";

import axiosInstance from "../utils/axios";
import { AuthUser, useAuthStore } from "./useAuthStore";

interface Message {
  _id: string;
  chatId: string;
  senderId: { _id: string; full_name: string; profile_pic_url: string };
  text: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}
export interface Chat {
  _id: string;
  participants: AuthUser[];
  name?: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: Message;
  profile_pic_url: string;
}
interface ChatState {
  messages: Message[];
  users: AuthUser[];
  chats: Chat[];
  allChats: Chat[];

  selectedChat: Chat | null;
  selectedUser: AuthUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isChatsLoading: boolean;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessage: (text: string, image: string) => Promise<void>;
  setSelectedUser: (user: AuthUser | null) => void;
  setSelectedChat: (chat: Chat | null) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
  getPersonalContacts: () => Promise<void>;
  getAllChats: () => Promise<void>;
}
export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  users: [],
  chats: [],
  allChats: [],
  selectedChat: null,
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isChatsLoading: false,

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
  getMessages: async (chatId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages`, { params: { chatId } });
      set({ messages: res.data });
    } catch (error) {
      toastError("Error fetching messages");
      console.error("Error fetching messages", error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (text: string, image: string) => {
    const { selectedChat, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedChat?._id}`,
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
  subscribeToMessages: () => {
    const { selectedChat } = get();

    if (!selectedChat) return;
    const socket = useAuthStore.getState().socket;
    socket?.on("newMessage", (newMessage: Message) => {
      if (newMessage.chatId !== selectedChat._id) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("newMessage");
  },
  setSelectedUser: (user: AuthUser | null) => set({ selectedUser: user }),
  setSelectedChat: (chat: Chat | null) => set({ selectedChat: chat }),

  getPersonalContacts: async () => {
    try {
      const response = await axiosInstance.get("/chats/private");
      set({ chats: response.data });
    } catch (error) {
      console.error("Error fetching personal contacts: ", error);
      toastError("An unexpected error occurred");
    }
  },

  getAllChats: async () => {
    set({ isChatsLoading: true });
    try {
      const response = await axiosInstance.get("/chats");
      set({ allChats: response.data });
      set({ isChatsLoading: false });
    } catch (error) {
      console.error("Error fetching chats: ", error);
      toastError("An unexpected error occurred");
    }
  },
}));
