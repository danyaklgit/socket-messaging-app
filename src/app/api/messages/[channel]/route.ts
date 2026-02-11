import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { MESSAGES_TO_FETCH } from "@/lib/constants";
import type { Message } from "@/lib/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ channel: string }> }
) {
  const { channel } = await params;

  // Fetch last N messages from sorted set
  const rawMessages = await redis.zrange(
    `messages:${channel}`,
    -MESSAGES_TO_FETCH,
    -1
  );

  const messages: Message[] = rawMessages.map((raw) => {
    if (typeof raw === "string") return JSON.parse(raw);
    return raw as unknown as Message;
  });

  return NextResponse.json({ messages });
}
