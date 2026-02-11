"use client";

import { create } from "zustand";

interface MemberInfo {
  username: string;
  avatarUrl: string;
}

interface PresenceState {
  members: Record<string, MemberInfo>;
  setMembers: (members: Record<string, MemberInfo>) => void;
  addMember: (userId: string, info: MemberInfo) => void;
  removeMember: (userId: string) => void;
}

export const usePresenceStore = create<PresenceState>((set) => ({
  members: {},
  setMembers: (members) => set({ members }),
  addMember: (userId, info) =>
    set((state) => ({ members: { ...state.members, [userId]: info } })),
  removeMember: (userId) =>
    set((state) => {
      const { [userId]: _, ...rest } = state.members;
      return { members: rest };
    }),
}));
