import { decrypt } from "@/services/backend";
import firebaseAdmin from "@/services/firebase-admin";
import { Order } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).send({ error: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "No token is provided" });

  let uid;

  try {
    uid = (await firebaseAdmin.auth().verifyIdToken(token)).uid;
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }

  const user = await firebaseAdmin.auth().getUser(uid);

  if (user?.customClaims)
    return res.status(403).json({ error: "not authorized" });

  if (user.customClaims?.role !== "driver")
    return res.status(403).json({ error: "not authorized" });

  const { orderCode } = req.query as {
    orderCode?: string;
  };

  if (!orderCode)
    return res.status(400).send({ error: "No orderCode is provided" });

  const order = (await decrypt(orderCode)) as Order & { id: string };

  if (!order || !order?.id)
    return res.status(404).send({ error: "Order not found" });

  const orderRef = await firebaseAdmin
    .database()
    .ref(`orders/${order.id}`)
    .get();

  if (!orderRef.exists() || !orderRef.val())
    return res.status(404).send({ error: "Order not found" });

  await firebaseAdmin.database().ref(`orders/${order.id}`).update({
    status: "completed",
  });

  res.status(200).send({ status: "completed" });
}
