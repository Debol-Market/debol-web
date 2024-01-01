import admin from "@/services/firebase-admin";
import stripe from "@/services/stripe";
import { Basket, BasketItemData, ProductItemData } from "@/utils/types";
import { BasketItemSchema, ProductItemSchema } from "@/utils/zodSchemas";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { Product } from "../../utils/types";

const requestSchema = z.object({
  productCart: z.array(ProductItemSchema).min(1),
  basketCart: z.array(BasketItemSchema).min(1),
  name: z.string().optional(),
  phone1: z.string(),
  phone2: z.string().optional(),
  paymentMethod: z.enum(["stripe", "chapa"]).default("stripe"),
});

type LineItem = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
    };
    unit_amount: number;
  };
  quantity: number;
  adjustable_quantity?: {
    enabled: boolean;
    minimum?: number;
    maximum?: number;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST")
    return res.status(405).send({ error: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "No token is provided" });

  let uid: string;

  try {
    uid = (await admin.auth().verifyIdToken(token)).uid;
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  const user = await admin.auth().getUser(uid);

  const valRes = requestSchema.safeParse(req.body);

  if (!valRes.success) {
    return res.status(400).send({ error: valRes.error.message });
  }

  const { productCart, basketCart, name, phone1, phone2, paymentMethod } =
    valRes.data;

  if (paymentMethod == "chapa") {
    return res.status(400).send({ error: "Payment method not supported" });
  }

  let total = 0;

  const basketBrought = await verifyBasketItems(basketCart);
  const productBrought = await verifyProductItems(productCart);

  total = basketBrought.total + productBrought.total;
  const line_items = [
    ...basketBrought.line_items,
    ...productBrought.line_items,
  ];

  // For Delivery Fee
  line_items.push({
    price_data: {
      currency: "usd",
      product_data: {
        name: "Distribution and Delivery Fee(20%)",
      },
      unit_amount: total * 0.2,
    },
    quantity: 1,
    adjustable_quantity: {
      enabled: false,
    },
  });

  const userData: any = {
    signinMethod: user.providerData[0].providerId,
  };

  if (user.email) userData.email = user.email;
  if (user.phoneNumber) userData.phone = user.phoneNumber;

  const orderRef = await admin.database().ref("orders/").push({
    name,
    phone1,
    phone2,
    uid,
    status: "payment pending",
    baskets: basketBrought.basketBrought,
    products: productBrought.productBrought,
    timestamp: Date.now(),
    user: userData,
    paymentMethod,
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      invoice_creation: {
        enabled: true,
      },
      line_items,
      payment_intent_data: { metadata: { orderId: orderRef.key } },
      success_url: `${process.env.HOST}/order/${orderRef.key}`,
    });

    res.status(200).json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
}

async function verifyProductItems(
  productCart: z.infer<typeof ProductItemSchema>[],
): Promise<{
  productBrought: ProductItemData[];
  total: number;
  line_items: LineItem[];
}> {
  let total = 0;
  const line_items: LineItem[] = [];
  const productBrought: ProductItemData[] = [];

  for (let item of productCart) {
    if (item.qty == 0) continue;
    const ProductRef = await admin
      .database()
      .ref(`products/${item.productId}`)
      .get();
    if (!ProductRef.exists || !ProductRef.val()) continue;

    const product = ProductRef.val() as Product;

    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: `${product.name} -`,
        },
        unit_amount: product.price,
      },
      quantity: item.qty,
      adjustable_quantity: {
        enabled: false,
      },
    });

    productBrought.push({
      productId: item.productId,
      qty: item.qty,
      product,
    });

    total += product.price * item.qty;
  }

  return {
    productBrought,
    total,
    line_items,
  };
}

async function verifyBasketItems(
  basketCart: z.infer<typeof BasketItemSchema>[],
): Promise<{
  basketBrought: BasketItemData[];
  total: number;
  line_items: LineItem[];
}> {
  let total = 0;
  const line_items: LineItem[] = [];
  const basketBrought: BasketItemData[] = [];

  for (let item of basketCart) {
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
    basketBrought.push({
      basketId: item.basketId,
      sizeId: item.sizeId,
      basket,
      qty: item.qty,
    });
    total += size.price * item.qty;
  }
  return {
    basketBrought,
    total,
    line_items,
  };
}
