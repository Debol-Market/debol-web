import { NextRequest, NextResponse } from "next/server";
import admin from "@/services/firebase-admin";
import { pusherClient } from "@/services/pusher";

export async function GET(req: NextRequest) {
  const token = req?.headers.get("authorization")?.split(" ")[1];

  if (!token)
    return NextResponse.json(
      { error: "No token is provided" },
      { status: 403 },
    );

  let uid: string;

  try {
    uid = (await admin.auth().verifyIdToken(token)).uid;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  const user = await admin.auth().getUser(uid);

  if (!user || user.customClaims?.role != "admin")
    return NextResponse.json({ error: "Not Authorized" }, { status: 403 });

  const beamsToken = pusherClient.generateToken(user.uid);
  return NextResponse.json(beamsToken);
}
