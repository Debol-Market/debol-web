import { pusherClient } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await pusherClient.publishToInterests(["Admin"], {
    web: {
      notification: {
        title: "New Order!",
      },
    },
  });

  return NextResponse.json({ success: true });
}
