"use client";

import { useChatStore } from "@/stores/use-chat-store";
import { ChannelItem } from "./channel-item";
import { UserPanel } from "./user-panel";

export function Sidebar() {
  const { channels, activeChannelId, setActiveChannel, resetUnread } =
    useChatStore();

  function handleChannelClick(channelId: string) {
    setActiveChannel(channelId);
    resetUnread(channelId);
  }

  return (
    <div className="flex h-full flex-col bg-bg-secondary">
      {/* Server header */}
      <div className="flex h-12 items-center border-b border-divider px-4 shadow-sm">
        <h1 className="text-[15px] font-semibold text-text-primary">
          Socket Chat
        </h1>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto px-2 pt-4">
        <div className="mb-1 flex items-center px-1">
          <span className="text-[11px] font-bold uppercase tracking-wide text-text-muted">
            Text Channels
          </span>
        </div>
        {channels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannelId}
            onClick={() => handleChannelClick(channel.id)}
          />
        ))}
      </div>

      {/* User panel */}
      <UserPanel />
    </div>
  );
}
