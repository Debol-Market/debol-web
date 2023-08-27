import admin from "@/services/firebase-admin";
import stripe from "@/services/stripe";
import { Basket, PaymentData } from "@/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send({ error: "Method not allowed" });

  const { items, name, phone1, phone2 } = req.body as {
    items?: PaymentData[];
    name?: string;
    phone1?: string;
    phone2?: string;
  };

  if (!items) return res.status(400).send({ error: "Cart is empty" });
  if (!name || !phone1 || !phone2)
    return res.status(400).send({ error: "No Shipping info is provided" });

  const line_items = [];
  for (let item of items) {
    if (item.qty == 0) continue;
    const basketRef = await admin
      .database()
      .ref(`baskets/${item.basketId}`)
      .get();
    if (!basketRef.exists || !basketRef.val()) continue;

    const basket = basketRef.val() as Basket;
    const size = basket.sizes.find((size) => size.id == item.sizeId);

    if (!size) continue;
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${basket.name} - ${size.name}`,
        },
        unit_amount: size.price,
      },
      quantity: item.qty,
      adjustable_quantity: {
        enabled: false,
      },
    });
  }

  const orderRef = await await admin.database().ref("orders/").push({
    name,
    phone1,
    phone2,
    status: "payment pending",
    items,
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      payment_intent_data: { metadata: { orderId: orderRef.key } },
      success_url: `http://localhost:3000/order/${orderRef.key}`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}
