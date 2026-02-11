"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/use-user-store";
import { getAvatarUrl } from "@/lib/utils";

export function UsernameModal() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useUserStore();
  const router = useRouter();

  const isValid = username.trim().length >= 2 && username.trim().length <= 20;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim();

    if (trimmed.length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (trimmed.length > 20) {
      setError("Username must be 20 characters or less");
      return;
    }

    setUser(trimmed);
    router.push("/chat/general");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md rounded-lg bg-bg-secondary p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path
                d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"
                fill="currentColor"
              />
              <path d="M7 9h2v2H7V9zm4 0h2v2h-2V9zm4 0h2v2h-2V9z" fill="currentColor" />
            </svg>
            <h1 className="text-2xl font-bold text-text-primary">Socket Chat</h1>
          </div>
          <p className="text-sm text-text-muted">
            Real-time messaging powered by WebSockets
          </p>
        </div>

        {/* Avatar preview */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            {username.trim() ? (
              <img
                src={getAvatarUrl(username.trim())}
                alt="Avatar preview"
                width={80}
                height={80}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-bg-tertiary">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-text-muted">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full border-[3px] border-bg-secondary bg-green-online" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="username"
            className="mb-2 block text-xs font-bold uppercase tracking-wide text-text-secondary"
          >
            Choose a username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            placeholder="Enter your username"
            maxLength={20}
            autoFocus
            className="mb-2 w-full rounded-[4px] bg-bg-primary px-3 py-2.5 text-text-primary placeholder:text-text-muted outline-none focus:ring-2 focus:ring-accent transition-shadow"
          />
          {error && (
            <p className="mb-2 text-xs text-danger">{error}</p>
          )}
          <p className="mb-4 text-xs text-text-muted">
            This is how others will see you in chat.
          </p>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-[4px] bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}
