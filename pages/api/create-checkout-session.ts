import admin from "@/services/firebase-admin";
import stripe from "@/services/stripe";
import {
  Basket,
  BasketItem,
  BasketItemData,
  ProductItem,
  ProductItemData,
} from "@/utils/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { Product } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).send({ error: "Method not allowed" });

  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(403).json({ error: "No token is provided" });

  let uid;

  try {
    uid = (await admin.auth().verifyIdToken(token)).uid;
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }

  const user = await admin.auth().getUser(uid);

  const { productCart, basketCart, name, phone1, phone2 } = req.body as {
    productCart: ProductItem[];
    basketCart: BasketItem[];
    name?: string;
    phone1?: string;
    phone2?: string;
  };

  if (!productCart || !basketCart)
    return res.status(400).send({ error: "Cart is empty" });
  if (!productCart.length && !basketCart.length)
    return res.status(400).send({ error: "Cart is empty" });
  if (!name || !phone1 || !phone2)
    return res.status(400).send({ error: "No Shipping info is provided" });

  const basketBrought: BasketItemData[] = [];
  const productBrought: ProductItemData[] = [];

  const line_items = [];
  let total = 0;

  // For Basket Items
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

  // For Product Items
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
    baskets: basketBrought,
    products: productBrought,
    timestamp: Date.now(),
    user: userData,
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
