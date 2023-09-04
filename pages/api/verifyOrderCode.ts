import { decrypt } from "@/services/backend";
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

  const order = await decrypt(orderCode);

  res.status(200).send(order);
}
