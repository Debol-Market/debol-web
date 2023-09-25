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

  if (!token) return res.status(403).json({ error: "No token is provided" });
  const uid = (await admin.auth().verifyIdToken(token)).uid;

  const ordersRef = await admin
    .database()
    .ref(`orders/`)
    .orderByChild("uid")
    .equalTo(uid)
    .get();

  if (!ordersRef.exists() || !ordersRef.val())
    return res.status(200).send({ orders: [] });

  const orders = Object.entries(ordersRef.val()).map(([k, v]) => ({
    id: k,
    ...(v as Order),
  }));

  res.status(200).send({ orders });
}
