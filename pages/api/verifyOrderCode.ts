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

  res.status(200).send(order);
}
