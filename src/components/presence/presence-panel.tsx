"use client";

import { usePresenceStore } from "@/stores/use-presence-store";
import { UserAvatar } from "./user-avatar";

export function PresencePanel() {
  const { members } = usePresenceStore();
  const memberList = Object.entries(members);

  return (
    <div className="flex h-full flex-col bg-bg-secondary">
      {/* Header */}
      <div className="flex h-12 items-center border-b border-divider px-4 shadow-sm">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-secondary">
          Online — {memberList.length}
        </h2>
      </div>

      {/* Member list */}
      <div className="flex-1 overflow-y-auto px-2 pt-4">
        {memberList.length === 0 ? (
          <p className="px-2 text-sm text-text-muted">No users online</p>
        ) : (
          memberList.map(([userId, info]) => (
            <div
              key={userId}
              className="flex items-center gap-3 rounded-[4px] px-2 py-1.5 transition-colors hover:bg-surface-hover/50"
            >
              <UserAvatar
                username={info.username}
                size={32}
                showStatus
                isOnline
              />
              <span className="truncate text-sm text-text-secondary">
                {info.username}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
