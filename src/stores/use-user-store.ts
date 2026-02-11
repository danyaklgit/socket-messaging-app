"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getAvatarUrl } from "@/lib/utils";

interface UserState {
  userId: string;
  username: string;
  avatarUrl: string;
  isAuthenticated: boolean;
  setUser: (username: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userId: "",
      username: "",
      avatarUrl: "",
      isAuthenticated: false,
      setUser: (username: string) => {
        const userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        set({
          userId,
          username,
          avatarUrl: getAvatarUrl(username),
          isAuthenticated: true,
        });
      },
      logout: () =>
        set({
          userId: "",
          username: "",
          avatarUrl: "",
          isAuthenticated: false,
        }),
    }),
    { name: "user-store" }
  )
);
