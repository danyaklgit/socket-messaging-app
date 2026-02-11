"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";
import { useUserStore } from "@/stores/use-user-store";
import { ReactionBadge } from "./reaction-badge";
import { EmojiPicker } from "./emoji-picker";

interface MessageBubbleProps {
  message: Message;
  isGrouped: boolean;
  channelId: string;
}

export function MessageBubble({
  message,
  isGrouped,
  channelId,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { userId } = useUserStore();

  return (
    <div
      className={`group relative flex gap-4 px-4 py-0.5 transition-colors hover:bg-surface-hover/30 ${
        !isGrouped ? "mt-4 pt-1" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setShowEmojiPicker(false);
      }}
    >
      {/* Avatar column */}
      <div className="w-10 flex-shrink-0">
        {!isGrouped && (
          <img
            src={message.avatarUrl}
            alt={message.username}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>

      {/* Content column */}
      <div className="min-w-0 flex-1">
        {!isGrouped && (
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-medium text-text-primary hover:underline cursor-pointer">
              {message.username}
            </span>
            <span className="text-xs text-text-muted">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>
        )}

        <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.375rem] text-text-secondary">
          {message.content}
        </p>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {message.reactions.map((reaction) => (
              <ReactionBadge
                key={reaction.emoji}
                emoji={reaction.emoji}
                count={reaction.userIds.length}
                isActive={reaction.userIds.includes(userId)}
                messageId={message.id}
                channelId={channelId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hover action bar */}
      {showActions && (
        <div className="absolute -top-3 right-4 flex items-center gap-0.5 rounded-[4px] border border-divider bg-bg-secondary p-0.5 shadow-md">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="rounded p-1 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
            title="Add Reaction"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
          </button>

          {/* Emoji picker dropdown */}
          {showEmojiPicker && (
            <div className="absolute top-full right-0 mt-1 z-50">
              <EmojiPicker
                messageId={message.id}
                channelId={channelId}
                onClose={() => setShowEmojiPicker(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
