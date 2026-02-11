"use client";

import { use, useEffect, useRef, useCallback } from "react";
import { usePusher } from "@/components/providers/pusher-provider";
import { useChatStore } from "@/stores/use-chat-store";
import { useUserStore } from "@/stores/use-user-store";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { TYPING_TIMEOUT_MS, TYPING_DEBOUNCE_MS } from "@/lib/constants";
import type { Message, Reaction } from "@/lib/types";

export default function ChannelPage({
  params,
}: {
  params: Promise<{ channel: string }>;
}) {
  const { channel: channelId } = use(params);
  const { client } = usePusher();
  const {
    setMessages,
    addMessage,
    setActiveChannel,
    resetUnread,
    incrementUnread,
    activeChannelId,
    updateReaction,
    addReadReceipt,
    setTypingUsers,
  } = useChatStore();
  const { userId, username } = useUserStore();

  const typingTimeoutsRef = useRef<Record<string, NodeJS.Timeout>>({});
  const typingUsersRef = useRef<string[]>([]);
  const lastTypingRef = useRef(0);

  // Set active channel
  useEffect(() => {
    setActiveChannel(channelId);
    resetUnread(channelId);
  }, [channelId, setActiveChannel, resetUnread]);

  // Fetch message history
  useEffect(() => {
    fetch(`/api/messages/${channelId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) {
          setMessages(channelId, data.messages);
        }
      })
      .catch(() => {});
  }, [channelId, setMessages]);

  // Subscribe to Pusher channel events
  useEffect(() => {
    if (!client) return;

    const channel = client.subscribe(`private-channel-${channelId}`);

    // New messages
    channel.bind("new-message", (message: Message) => {
      addMessage(channelId, message);
      // If this channel isn't active, increment unread
      if (channelId !== useChatStore.getState().activeChannelId) {
        incrementUnread(channelId);
      }
    });

    // Reaction updates
    channel.bind(
      "reaction-update",
      (data: {
        messageId: string;
        reactions: Reaction[];
      }) => {
        updateReaction(channelId, data.messageId, data.reactions);
      }
    );

    // Read receipts
    channel.bind(
      "read-receipt",
      (data: { messageId: string; userId: string }) => {
        addReadReceipt(channelId, data.messageId, data.userId);
      }
    );

    // Typing events (client events — no server roundtrip)
    channel.bind(
      "client-typing",
      (data: { userId: string; username: string }) => {
        if (data.userId === userId) return;

        // Add to typing users
        if (!typingUsersRef.current.includes(data.username)) {
          typingUsersRef.current = [...typingUsersRef.current, data.username];
          setTypingUsers(channelId, [...typingUsersRef.current]);
        }

        // Clear existing timeout for this user
        if (typingTimeoutsRef.current[data.userId]) {
          clearTimeout(typingTimeoutsRef.current[data.userId]);
        }

        // Set timeout to remove typing user
        typingTimeoutsRef.current[data.userId] = setTimeout(() => {
          typingUsersRef.current = typingUsersRef.current.filter(
            (u) => u !== data.username
          );
          setTypingUsers(channelId, [...typingUsersRef.current]);
          delete typingTimeoutsRef.current[data.userId];
        }, TYPING_TIMEOUT_MS);
      }
    );

    return () => {
      channel.unbind_all();
      client.unsubscribe(`private-channel-${channelId}`);

      // Clear all typing timeouts
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
      typingTimeoutsRef.current = {};
      typingUsersRef.current = [];
    };
  }, [
    client,
    channelId,
    userId,
    addMessage,
    incrementUnread,
    updateReaction,
    addReadReceipt,
    setTypingUsers,
  ]);

  // Typing handler (debounced client event)
  const handleTyping = useCallback(() => {
    if (!client) return;

    const now = Date.now();
    if (now - lastTypingRef.current < TYPING_DEBOUNCE_MS) return;
    lastTypingRef.current = now;

    const channel = client.channel(`private-channel-${channelId}`);
    if (channel) {
      channel.trigger("client-typing", { userId, username });
    }
  }, [client, channelId, userId, username]);

  // Find channel description
  const channelInfo = useChatStore
    .getState()
    .channels.find((c) => c.id === channelId);

  return (
    <div className="flex h-full flex-col">
      {/* Channel header */}
      <div className="flex h-12 items-center gap-2 border-b border-divider px-4 shadow-sm">
        <span className="text-xl text-text-muted">#</span>
        <span className="font-semibold text-text-primary">{channelId}</span>
        {channelInfo?.description && (
          <>
            <div className="mx-2 h-6 w-px bg-divider" />
            <span className="truncate text-sm text-text-muted">
              {channelInfo.description}
            </span>
          </>
        )}
      </div>

      {/* Messages */}
      <MessageList channelId={channelId} />

      {/* Typing indicator */}
      <TypingIndicator channelId={channelId} />

      {/* Input */}
      <MessageInput channelId={channelId} onTyping={handleTyping} />
    </div>
  );
}
