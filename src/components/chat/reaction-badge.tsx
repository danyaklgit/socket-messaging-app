"use client";

import { useUserStore } from "@/stores/use-user-store";

interface ReactionBadgeProps {
  emoji: string;
  count: number;
  isActive: boolean;
  messageId: string;
  channelId: string;
}

export function ReactionBadge({
  emoji,
  count,
  isActive,
  messageId,
  channelId,
}: ReactionBadgeProps) {
  const { userId, username } = useUserStore();

  async function handleClick() {
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId,
        channelId,
        emoji,
        userId,
        username,
        action: isActive ? "remove" : "add",
      }),
    });
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${
        isActive
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-divider bg-bg-primary/50 text-text-muted hover:border-text-muted"
      }`}
    >
      <span>{emoji}</span>
      <span>{count}</span>
    </button>
  );
}
