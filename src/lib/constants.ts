import type { Channel } from "./types";

export const DEFAULT_CHANNELS: Channel[] = [
  { id: "general", name: "general", description: "General discussion", unreadCount: 0 },
  { id: "random", name: "random", description: "Off-topic chat", unreadCount: 0 },
  { id: "introductions", name: "introductions", description: "Say hello!", unreadCount: 0 },
  { id: "help", name: "help", description: "Get help here", unreadCount: 0 },
];

export const EMOJI_LIST = [
  { emoji: "👍", name: "thumbsup" },
  { emoji: "❤️", name: "heart" },
  { emoji: "😂", name: "joy" },
  { emoji: "🔥", name: "fire" },
  { emoji: "👀", name: "eyes" },
  { emoji: "🎉", name: "tada" },
  { emoji: "💯", name: "100" },
  { emoji: "🚀", name: "rocket" },
  { emoji: "👎", name: "thumbsdown" },
  { emoji: "😮", name: "open_mouth" },
  { emoji: "🤔", name: "thinking" },
  { emoji: "✅", name: "check" },
] as const;

export const MAX_MESSAGES_PER_CHANNEL = 100;
export const MESSAGES_TO_FETCH = 50;
export const TYPING_TIMEOUT_MS = 3000;
export const TYPING_DEBOUNCE_MS = 300;
