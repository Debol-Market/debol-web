import { pusherClient } from "@/services/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await pusherClient.publishToInterests(["Admin"], {
    web: {
      notification: {
        title: "This is a test from Debol market",
        body: 'Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidata',
        deep_link: process.env.HOST + "/admin",
      },
    },
  });

  return NextResponse.json({ success: true });
}
