import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher-server";
import { getAvatarUrl } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { socket_id, channel_name, userId, username } = body;

  if (!socket_id || !channel_name || !userId || !username) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  // Presence channels include user data
  if (channel_name.startsWith("presence-")) {
    const presenceData = {
      user_id: userId,
      user_info: {
        username,
        avatarUrl: getAvatarUrl(username),
      },
    };
    const authResponse = pusherServer.authorizeChannel(
      socket_id,
      channel_name,
      presenceData
    );
    return NextResponse.json(authResponse);
  }

  // Private channels
  if (channel_name.startsWith("private-")) {
    const authResponse = pusherServer.authorizeChannel(socket_id, channel_name);
    return NextResponse.json(authResponse);
  }

  return NextResponse.json({ error: "Invalid channel" }, { status: 403 });
}
