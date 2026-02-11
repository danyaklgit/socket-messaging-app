"use client";

import { useUserStore } from "@/stores/use-user-store";
import { EMOJI_LIST } from "@/lib/constants";

interface EmojiPickerProps {
  messageId: string;
  channelId: string;
  onClose: () => void;
}

export function EmojiPicker({ messageId, channelId, onClose }: EmojiPickerProps) {
  const { userId, username } = useUserStore();

  async function handleReact(emoji: string) {
    onClose();
    await fetch("/api/reactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId,
        channelId,
        emoji,
        userId,
        username,
        action: "add",
      }),
    });
  }

  return (
    <div className="grid w-[200px] grid-cols-4 gap-1 rounded-lg border border-divider bg-bg-primary p-2 shadow-xl">
      {EMOJI_LIST.map(({ emoji, name }) => (
        <button
          key={name}
          onClick={() => handleReact(emoji)}
          className="flex h-9 w-9 items-center justify-center rounded text-lg transition-colors hover:bg-surface-hover"
          title={name}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
