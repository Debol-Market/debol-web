import admin from "@/services/firebase-admin";
import stripe from "@/services/stripe";
import { buffer } from "micro";
import { NextApiRequest, NextApiResponse } from "next";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
// apiVersion: "2023-08-16",
// });
const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send({ error: "Method not allowed" });

  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  if (!sig) return res.status(400).send({ error: "Signature not found" });
  if (!webhookSecret)
    return res.status(400).send({ error: "Webhook secret not found" });

  let event = req.body;

  try {
    event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
  } catch (err) {
    console.log((err as Error).message);
    res.status(400).send(`Webhook Error: ${err}`);
    return;
  }

      const charge = event.data.object;
      const { orderId } = charge.metadata as { orderId: string };

  switch (event.type) {
    case "charge.succeeded":
      admin.database().ref(`orders/${orderId}`).update({
        paymentId: charge.id,
        status: "pending",
      });
      break;
    case "charge.failed":
      admin.database().ref(`orders/${orderId}`).remove();
      break;

    default:
      break;
  }

  res.status(200).json({ received: true });
}

// const cors = Cors({
// allowMethods: ["POST", "HEAD"],
// });

// export default cors(handler as any);
