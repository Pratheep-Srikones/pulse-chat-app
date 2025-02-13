import { create } from "zustand";
import axiosInstance from "../utils/axios";
import axios from "axios";
import { toastError, toastSuccess } from "../utils/notify";
export interface AuthUser {
  user: {
    _id: string;
    email: string;
    full_name: string;
    profile_pic_url: string;
    bio: string;
    createdAt: string;
    updatedAt: string;
  };
}
interface AuthState {
  authUser: AuthUser | null; // Change `any` to a specific type if possible
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: AuthUser["user"][];

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
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
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
      toastSuccess("Logged in successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred");
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

      set((state) => ({
        authUser: {
          ...state.authUser,
          user: res.data.updatedUser,
        },
      })); // Update state with new user data
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
      set((state) => ({
        authUser: {
          ...state.authUser,
          user: res.data.updatedUser,
        },
      })); // Update state with new user data
      toastSuccess("Bio updated successfully");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toastError(error.response.data.message);
      } else {
        toastError("An unexpected error occurred");
      }
    }
  },
}));
