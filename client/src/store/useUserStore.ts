import { create } from "zustand";
import axiosInstance from "../utils/axios";

import { toastError } from "../utils/notify";
import { AuthUser } from "./useAuthStore";
interface UserState {
  user: AuthUser | null;
  getUserByEmail: (email: string) => Promise<void>;
  createChat: (participants: string[], name?: string) => Promise<void>;
  resetUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  getUserByEmail: async (email: string) => {
    try {
      const response = await axiosInstance.get(`/users`, { params: { email } });
      console.log("Response:", response.data);
      set({ user: response.data });
    } catch (error) {
      console.error("Error getting user by email", error);
      toastError("An unexpected error occurred");
    }
  },
  createChat: async (participants: string[], name?: string) => {
    try {
      const response = await axiosInstance.post("/chats/new", {
        participants,
        name,
      });
      console.log("Chat created:", response.data);
    } catch (error) {
      console.error("Error creating chat", error);
      toastError("An unexpected error occurred");
    }
  },

  resetUser: () => set({ user: null }),
}));
