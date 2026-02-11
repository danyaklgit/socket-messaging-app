import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { pusherServer } from "@/lib/pusher-server";
import { redis } from "@/lib/redis";
import { MAX_MESSAGES_PER_CHANNEL } from "@/lib/constants";
import type { Message } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { channelId, userId, username, content, avatarUrl } = body;

  if (!channelId || !userId || !username || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const message: Message = {
    id: nanoid(),
    channelId,
    userId,
    username,
    avatarUrl,
    content: content.trim(),
    timestamp: Date.now(),
    reactions: [],
    readBy: [userId],
  };

  // Persist to Redis sorted set
  await redis.zadd(`messages:${channelId}`, {
    score: message.timestamp,
    member: JSON.stringify(message),
  });

  // Trim to cap storage
  const count = await redis.zcard(`messages:${channelId}`);
  if (count > MAX_MESSAGES_PER_CHANNEL) {
    await redis.zremrangebyrank(
      `messages:${channelId}`,
      0,
      count - MAX_MESSAGES_PER_CHANNEL - 1
    );
  }

  // Broadcast to all subscribers
  await pusherServer.trigger(
    `private-channel-${channelId}`,
    "new-message",
    message
  );

  return NextResponse.json({ success: true, message });
}
