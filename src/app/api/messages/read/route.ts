import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher-server";

export async function POST(req: NextRequest) {
  const { messageId, channelId, userId } = await req.json();

  if (!messageId || !channelId || !userId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Broadcast read receipt (ephemeral — not persisted)
  await pusherServer.trigger(
    `private-channel-${channelId}`,
    "read-receipt",
    {
      messageId,
      userId,
    }
  );

  return NextResponse.json({ success: true });
}
