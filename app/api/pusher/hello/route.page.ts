import { NextRequest, NextResponse } from "next/server";
import PushNotifications from "@pusher/push-notifications-server";
import { pusherClient } from "@/services/pusher";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const uid = url.searchParams.get("uid");

  if (!uid) return NextResponse.json({ error: "No uid" });

  await pusherClient.publishToInterests(["Admin"], {
    web: {
      notification: {
        title: "New Order!",
      },
    },
  });

  return NextResponse.json({ success: true });
}
