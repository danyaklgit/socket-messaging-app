"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/stores/use-chat-store";
import { MessageBubble } from "./message-bubble";
import type { Message } from "@/lib/types";

const EMPTY_MESSAGES: Message[] = [];

interface MessageListProps {
  channelId: string;
}

export function MessageList({ channelId }: MessageListProps) {
  const messages = useChatStore((state) => state.messages[channelId] ?? EMPTY_MESSAGES);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    if (isNearBottomRef.current) {
      scrollToBottom();
    }
  }, [messages]);

  function scrollToBottom() {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }

  function handleScroll() {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    isNearBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
  }

  function isGrouped(index: number): boolean {
    if (index === 0) return false;
    const prev = messages[index - 1];
    const curr = messages[index];
    return (
      prev.userId === curr.userId &&
      curr.timestamp - prev.timestamp < 5 * 60 * 1000
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-bg-primary">
          <span className="text-3xl text-text-muted">#</span>
        </div>
        <h2 className="mb-1 text-2xl font-bold text-text-primary">
          Welcome to #{channelId}
        </h2>
        <p className="text-text-muted">
          This is the very beginning of the <strong>#{channelId}</strong>{" "}
          channel.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto pb-4"
    >
      {/* Channel start header */}
      <div className="mb-2 px-4 pt-6">
        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-bg-primary">
          <span className="text-3xl text-text-muted">#</span>
        </div>
        <h2 className="mb-1 text-2xl font-bold text-text-primary">
          Welcome to #{channelId}
        </h2>
        <p className="mb-4 text-text-muted">
          This is the very beginning of the <strong>#{channelId}</strong>{" "}
          channel.
        </p>
        <div className="border-b border-divider" />
      </div>

      {/* Messages */}
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isGrouped={isGrouped(index)}
          channelId={channelId}
        />
      ))}
    </div>
  );
}
