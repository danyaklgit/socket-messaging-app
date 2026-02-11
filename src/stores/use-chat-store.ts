"use client";

import { create } from "zustand";
import { DEFAULT_CHANNELS } from "@/lib/constants";
import type { Message, Channel, Reaction } from "@/lib/types";

interface ChatState {
  channels: Channel[];
  activeChannelId: string;
  messages: Record<string, Message[]>;
  typingUsers: Record<string, string[]>;

  setActiveChannel: (channelId: string) => void;
  addMessage: (channelId: string, message: Message) => void;
  setMessages: (channelId: string, messages: Message[]) => void;
  updateReaction: (channelId: string, messageId: string, reactions: Reaction[]) => void;
  addReadReceipt: (channelId: string, messageId: string, userId: string) => void;
  setTypingUsers: (channelId: string, usernames: string[]) => void;
  incrementUnread: (channelId: string) => void;
  resetUnread: (channelId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  channels: DEFAULT_CHANNELS,
  activeChannelId: "general",
  messages: {},
  typingUsers: {},

  setActiveChannel: (channelId) => set({ activeChannelId: channelId }),

  addMessage: (channelId, message) =>
    set((state) => {
      const existing = state.messages[channelId] || [];
      if (existing.some((m) => m.id === message.id)) return state;
      return {
        messages: {
          ...state.messages,
          [channelId]: [...existing, message],
        },
      };
    }),

  setMessages: (channelId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [channelId]: messages },
    })),

  updateReaction: (channelId, messageId, reactions) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).map((msg) =>
          msg.id === messageId ? { ...msg, reactions } : msg
        ),
      },
    })),

  addReadReceipt: (channelId, messageId, userId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [channelId]: (state.messages[channelId] || []).map((msg) =>
          msg.id === messageId && !msg.readBy.includes(userId)
            ? { ...msg, readBy: [...msg.readBy, userId] }
            : msg
        ),
      },
    })),

  setTypingUsers: (channelId, usernames) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [channelId]: usernames },
    })),

  incrementUnread: (channelId) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unreadCount: ch.unreadCount + 1 } : ch
      ),
    })),

  resetUnread: (channelId) =>
    set((state) => ({
      channels: state.channels.map((ch) =>
        ch.id === channelId ? { ...ch, unreadCount: 0 } : ch
      ),
    })),
}));
