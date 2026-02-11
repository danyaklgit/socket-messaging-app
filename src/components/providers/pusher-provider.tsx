"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type PusherClient from "pusher-js";
import type { PresenceChannel } from "pusher-js";
import { getPusherClient, disconnectPusher } from "@/lib/pusher-client";
import { useUserStore } from "@/stores/use-user-store";
import { usePresenceStore } from "@/stores/use-presence-store";

interface PusherContextValue {
  client: PusherClient | null;
}

const PusherContext = createContext<PusherContextValue>({
  client: null,
});

export function usePusher() {
  return useContext(PusherContext);
}

export function PusherProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<PusherClient | null>(null);
  const { username, userId } = useUserStore();
  const { setMembers, addMember, removeMember } = usePresenceStore();

  useEffect(() => {
    if (!username || !userId) return;

    const pusher = getPusherClient();
    setClient(pusher);

    // Subscribe to global presence channel
    const presence = pusher.subscribe(
      "presence-global"
    ) as PresenceChannel;

    presence.bind(
      "pusher:subscription_succeeded",
      (members: {
        each: (
          cb: (member: {
            id: string;
            info: { username: string; avatarUrl: string };
          }) => void
        ) => void;
      }) => {
        const memberMap: Record<
          string,
          { username: string; avatarUrl: string }
        > = {};
        members.each((member) => {
          memberMap[member.id] = member.info;
        });
        setMembers(memberMap);
      }
    );

    presence.bind(
      "pusher:member_added",
      (member: {
        id: string;
        info: { username: string; avatarUrl: string };
      }) => {
        addMember(member.id, member.info);
      }
    );

    presence.bind("pusher:member_removed", (member: { id: string }) => {
      removeMember(member.id);
    });

    return () => {
      presence.unbind_all();
      pusher.unsubscribe("presence-global");
      disconnectPusher();
      setClient(null);
    };
  }, [username, userId, setMembers, addMember, removeMember]);

  return (
    <PusherContext.Provider value={{ client }}>
      {children}
    </PusherContext.Provider>
  );
}
