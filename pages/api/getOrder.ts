import { encrypt } from "@/services/backend";
import admin from "@/services/firebase-admin";
import { Order } from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET")
    return res.status(405).send({ error: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: 'No token is provided' });
  const uid = (await admin.auth().verifyIdToken(token)).uid;
  
  const { orderId } = req.query as {
    orderId?: string;
  };

  if (!orderId)
    return res.status(400).send({ error: "No orderId is provided" });

  const orderRef = await admin.database().ref(`orders/${orderId}`).get();

  if (!orderRef.exists() || !orderRef.val())
    return res.status(404).send({ error: "Order not found" });

  const order = orderRef.val() as Order;

  const orderCode = encrypt({ ...order, uid });
  console.log(orderCode);

  res.status(200).send({ ...order, orderCode: encrypt({ ...order, uid }) });
}
