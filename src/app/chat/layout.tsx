"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/use-user-store";
import { PusherProvider } from "@/components/providers/pusher-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { PresencePanel } from "@/components/presence/presence-panel";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useUserStore();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showPresence, setShowPresence] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push("/");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <PusherProvider>
      <div className="relative flex h-screen overflow-hidden">
        {/* Mobile overlay */}
        {(showSidebar || showPresence) && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => {
              setShowSidebar(false);
              setShowPresence(false);
            }}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-200 md:relative md:translate-x-0 ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>

        {/* Main chat area */}
        <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-bg-tertiary">
          {/* Mobile nav bar */}
          <div className="flex items-center gap-2 px-2 pt-2 md:hidden">
            <button
              onClick={() => setShowSidebar(true)}
              className="rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </button>
            <div className="flex-1" />
            <button
              onClick={() => setShowPresence(true)}
              className="rounded p-1.5 text-text-muted hover:bg-surface-hover hover:text-text-secondary"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
            </button>
          </div>
          {children}
        </main>

        {/* Presence panel */}
        <div
          className={`fixed inset-y-0 right-0 z-40 w-60 transform transition-transform duration-200 md:relative md:translate-x-0 ${
            showPresence ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <PresencePanel />
        </div>
      </div>
    </PusherProvider>
  );
}
