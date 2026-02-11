"use client";

import { useState, useRef, useCallback } from "react";
import { useUserStore } from "@/stores/use-user-store";

interface MessageInputProps {
  channelId: string;
  onTyping?: () => void;
}

export function MessageInput({ channelId, onTyping }: MessageInputProps) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { userId, username, avatarUrl } = useUserStore();

  const handleSend = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setContent("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId,
          userId,
          username,
          content: trimmed,
          avatarUrl,
        }),
      });
    } catch {
      // Restore content on error
      setContent(trimmed);
    } finally {
      setSending(false);
    }
  }, [content, sending, channelId, userId, username, avatarUrl]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    onTyping?.();

    // Auto-resize textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  return (
    <div className="px-4 pb-6 pt-1">
      <div className="flex items-end rounded-lg bg-bg-primary/70 px-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={`Message #${channelId}`}
          rows={1}
          className="max-h-[200px] flex-1 resize-none bg-transparent py-2.5 text-[15px] text-text-primary placeholder:text-text-muted outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!content.trim() || sending}
          className="mb-2 ml-2 rounded p-1.5 text-text-muted transition-colors hover:text-accent disabled:opacity-30"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
