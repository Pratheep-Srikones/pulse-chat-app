import { create } from "zustand";
import axiosInstance from "../utils/axios";
import axios from "axios";
import { toastError, toastSuccess } from "../utils/notify";
import io, { Socket } from "socket.io-client";
export interface AuthUser {
  _id: string;
  email: string;
  full_name: string;
  profile_pic_url: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}
interface AuthState {
  authUser: AuthUser | null; // Change `any` to a specific type if possible
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];

  socket: Socket | null;

  checkAuth: () => Promise<void>;
  signup: (formData: {
    full_name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  login: (formData: { email: string; password: string }) => Promise<void>;
  updateProfilePic: (profilePic: string) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;

  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.error("Error checking auth", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toastSuccess("Account created successfully");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toastSuccess("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      console.error("Error logging out", error);
      toastError("An unexpected error occurred");
    }
  },

  login: async (formData: { email: string; password: string }) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      console.log("AuthUser:", get().authUser);
      toastSuccess("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred while logging in");
        console.error("Error logging in", error);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfilePic: async (profilePicBase64: string) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", {
        profilePic: profilePicBase64, // Send as Base64
      });

      set({ authUser: res.data.updatedUser }); // Update state with new user data
      toastSuccess("Profile updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateBio: async (bio: string) => {
    try {
      const res = await axiosInstance.put("/auth/update-bio", { bio });
      set({ authUser: res.data.updatedUser }); // Update state with new user data
      toastSuccess("Bio updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred");
      }
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(import.meta.env.VITE_API_URL as string, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket && socket.connected) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
