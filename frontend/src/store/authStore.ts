import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  setUser: (user) => set({ user }),
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
    set({ accessToken: token, isAuthenticated: !!token });
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));
