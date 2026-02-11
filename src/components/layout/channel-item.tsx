"use client";

import Link from "next/link";
import type { Channel } from "@/lib/types";

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  onClick: () => void;
}

export function ChannelItem({ channel, isActive, onClick }: ChannelItemProps) {
  return (
    <Link
      href={`/chat/${channel.id}`}
      onClick={onClick}
      className={`group flex items-center gap-1.5 rounded-[4px] px-2 py-[6px] mb-[2px] transition-colors ${
        isActive
          ? "bg-surface-hover text-text-primary"
          : "text-text-muted hover:bg-surface-hover/50 hover:text-text-secondary"
      }`}
    >
      <span className="text-lg leading-none text-text-muted">#</span>
      <span className="flex-1 truncate text-[15px] leading-5">
        {channel.name}
      </span>
      {channel.unreadCount > 0 && (
        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-white">
          {channel.unreadCount > 99 ? "99+" : channel.unreadCount}
        </span>
      )}
    </Link>
  );
}
