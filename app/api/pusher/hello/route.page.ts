import { pusherClient } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await pusherClient.publishToInterests(["Admin"], {
    web: {
      notification: {
        title: "This is a test from Debol market",
      },
    },
  });

  return NextResponse.json({ success: true });
}
