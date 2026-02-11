"use client";

import { getAvatarUrl } from "@/lib/utils";

interface UserAvatarProps {
  username: string;
  size?: number;
  showStatus?: boolean;
  isOnline?: boolean;
}

export function UserAvatar({
  username,
  size = 32,
  showStatus = false,
  isOnline = false,
}: UserAvatarProps) {
  const dotSize = size >= 32 ? 12 : 8;

  return (
    <div className="relative inline-flex flex-shrink-0">
      <img
        src={getAvatarUrl(username)}
        alt={username}
        width={size}
        height={size}
        className="rounded-full"
      />
      {showStatus && (
        <div
          className={`absolute -bottom-0.5 -right-0.5 rounded-full border-[2px] border-bg-secondary ${
            isOnline ? "bg-green-online" : "bg-text-muted"
          }`}
          style={{ width: dotSize, height: dotSize }}
        />
      )}
    </div>
  );
}
