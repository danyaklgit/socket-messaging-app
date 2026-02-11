"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/use-user-store";

export function UserPanel() {
  const { username, avatarUrl, logout } = useUserStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <div className="flex items-center gap-2 border-t border-divider bg-bg-primary/50 px-2 py-2">
      <div className="relative">
        <img
          src={avatarUrl}
          alt={username}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-[2.5px] border-bg-secondary bg-green-online" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-text-primary">
          {username}
        </p>
        <p className="text-[11px] text-text-muted">Online</p>
      </div>
      <button
        onClick={handleLogout}
        title="Log out"
        className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-hover hover:text-text-secondary"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
