import PusherClient from "pusher-js";
import { useUserStore } from "@/stores/use-user-store";

let pusherInstance: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        channelAuthorization: {
          transport: "ajax",
          endpoint: "/api/pusher/auth",
          customHandler: async (params, callback) => {
            try {
              const user = useUserStore.getState();
              const response = await fetch("/api/pusher/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  socket_id: params.socketId,
                  channel_name: params.channelName,
                  userId: user.userId,
                  username: user.username,
                }),
              });
              if (!response.ok) {
                callback(new Error("Auth failed"), null);
                return;
              }
              const data = await response.json();
              callback(null, data);
            } catch (error) {
              callback(error as Error, null);
            }
          },
        },
      }
    );
  }
  return pusherInstance;
}

export function disconnectPusher() {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
