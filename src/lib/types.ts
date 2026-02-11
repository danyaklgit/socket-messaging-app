export interface User {
  userId: string;
  username: string;
  avatarUrl: string;
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: number;
  reactions: Reaction[];
  readBy: string[];
}

export interface Reaction {
  emoji: string;
  userIds: string[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  unreadCount: number;
}

export interface TypingEvent {
  userId: string;
  username: string;
  channelId: string;
}

export interface ReadReceiptEvent {
  messageId: string;
  userId: string;
  channelId: string;
}

export interface ReactionEvent {
  messageId: string;
  emoji: string;
  userId: string;
  username: string;
  action: "add" | "remove";
  channelId: string;
}
