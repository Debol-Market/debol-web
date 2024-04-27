import { encrypt } from "@/services/backend";
import admin from "@/services/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  code: z.string(),
  orderId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
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

    const valRes = requestSchema.safeParse(await req.json());

    if (!valRes.success) {
      console.log(valRes.error);
      return NextResponse.json(
        { error: valRes.error.message },
        { status: 400 },
      );
    }

    const { orderId, code } = valRes.data;

    const orderRef = await admin
      .database()
      .ref("orders/" + orderId)
      .get();

    if (!orderRef.val()) {
      return NextResponse.json({ error: "Order Not found" }, { status: 404 });
    }

    const orderCode = encrypt({
      uid,
      paymentId: orderRef.val().paymentId,
      id: orderId,
    });

    if (orderCode != code)
      return NextResponse.json({ error: "Invalid Code" }, { status: 401 });

    await admin
      .database()
      .ref("orders/" + orderId)
      .update({
        ...orderRef.val(),
        status: "completed",
      });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
