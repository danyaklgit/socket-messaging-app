import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher-server";
import { redis } from "@/lib/redis";
import type { Message, ReactionEvent } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body: ReactionEvent = await req.json();
  const { messageId, channelId, emoji, userId, action } = body;

  if (!messageId || !channelId || !emoji || !userId || !action) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Fetch all messages for the channel
  const rawMessages = await redis.zrange(`messages:${channelId}`, 0, -1);

  let targetRaw: string | null = null;
  let targetMessage: Message | null = null;

  for (const raw of rawMessages) {
    const parsed: Message =
      typeof raw === "string" ? JSON.parse(raw) : (raw as unknown as Message);
    if (parsed.id === messageId) {
      targetRaw = typeof raw === "string" ? raw : JSON.stringify(raw);
      targetMessage = parsed;
      break;
    }
  }

  if (!targetMessage || !targetRaw) {
    return NextResponse.json({ error: "Message not found" }, { status: 404 });
  }

  // Update reaction
  const existingReaction = targetMessage.reactions.find(
    (r) => r.emoji === emoji
  );

  if (action === "add") {
    if (existingReaction) {
      if (!existingReaction.userIds.includes(userId)) {
        existingReaction.userIds.push(userId);
      }
    } else {
      targetMessage.reactions.push({ emoji, userIds: [userId] });
    }
  } else {
    if (existingReaction) {
      existingReaction.userIds = existingReaction.userIds.filter(
        (id) => id !== userId
      );
      if (existingReaction.userIds.length === 0) {
        targetMessage.reactions = targetMessage.reactions.filter(
          (r) => r.emoji !== emoji
        );
      }
    }
  }

  // Update in Redis
  await redis.zrem(`messages:${channelId}`, targetRaw);
  await redis.zadd(`messages:${channelId}`, {
    score: targetMessage.timestamp,
    member: JSON.stringify(targetMessage),
  });

  // Broadcast reaction update
  await pusherServer.trigger(
    `private-channel-${channelId}`,
    "reaction-update",
    {
      messageId,
      emoji,
      userId,
      action,
      reactions: targetMessage.reactions,
    }
  );

  return NextResponse.json({ success: true });
}
