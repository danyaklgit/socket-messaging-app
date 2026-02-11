"use client";

import { useChatStore } from "@/stores/use-chat-store";

const EMPTY_TYPING: string[] = [];

interface TypingIndicatorProps {
  channelId: string;
}

export function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const typingUsers = useChatStore(
    (state) => state.typingUsers[channelId] ?? EMPTY_TYPING
  );

  function getText(): string {
    if (typingUsers.length === 0) return "";
    if (typingUsers.length === 1) return `${typingUsers[0]} is typing`;
    if (typingUsers.length === 2)
      return `${typingUsers[0]} and ${typingUsers[1]} are typing`;
    return "Several people are typing";
  }

  const text = getText();

  return (
    <div className="h-6 px-4">
      {text && (
        <div className="flex items-center gap-1 text-xs text-text-muted">
          <span className="flex gap-[2px]">
            <span className="typing-dot inline-block h-1 w-1 rounded-full bg-text-muted" />
            <span className="typing-dot inline-block h-1 w-1 rounded-full bg-text-muted" />
            <span className="typing-dot inline-block h-1 w-1 rounded-full bg-text-muted" />
          </span>
          <span className="ml-1 font-medium">{text}</span>
        </div>
      )}
    </div>
  );
}
