import admin from "@/services/firebase-admin";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  basketId: z.string(),
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

    const formdata: FormData = await req.formData();

    const valRes = requestSchema.safeParse(
      JSON.parse(formdata.get("obj") as string),
    );

    if (!valRes.success) {
      console.log(valRes.error);
      return NextResponse.json(
        { error: valRes.error.message },
        { status: 400 },
      );
    }

    const { basketId } = valRes.data;

    const basketRef = await admin
      .database()
      .ref("/baskets/" + basketId)
      .get();

    if (!basketRef.val()) {
      return NextResponse.json({ error: "Basket Not found" }, { status: 404 });
    }

    const image = formdata.get("image") as File;
    const buffer = await image.arrayBuffer();
    const bf = Buffer.from(buffer);

    const fileName = `baskets/${basketId}.webp`;

    await admin
      .storage()
      .bucket("debolpackages.appspot.com")
      .file(fileName)
      .save(bf);

    await admin
      .database()
      .ref("/baskets/" + basketId)
      .update({ image: fileName });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
