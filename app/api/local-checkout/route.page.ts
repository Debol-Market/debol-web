import admin from "@/services/firebase-admin";
import {
  Basket,
  BasketItemData,
  Product,
  ProductItemData,
} from "@/utils/types";
import { BasketItemSchema, ProductItemSchema } from "@/utils/zodSchemas";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({
  basketCart: z.array(BasketItemSchema),
  productCart: z.array(ProductItemSchema),
  name: z.string().optional(),
  phone1: z.string(),
  phone2: z.string().optional(),
  bank: z.enum(["cbe", "dashen", "abysinnia"]).default("cbe"),
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

    const { basketCart, name, phone1, phone2, bank, productCart } = valRes.data;

    const basketBrought = await verifyBasketItems(basketCart);
    const productBrought = await verifyProductItems(productCart);

    const total = basketBrought.total + productBrought.total;

    const userData: any = {
      signinMethod: user.providerData[0].providerId,
    };

    const image = formdata.get("image") as File;
    const buffer = await image.arrayBuffer();
    const bf = Buffer.from(buffer);

    const fileName = `bill/${Date.now()}.png`;

    await admin
      .storage()
      .bucket("debolpackages.appspot.com")
      .file(fileName)
      .save(bf);

    if (user.email) userData.email = user.email;
    if (user.phoneNumber) userData.phone = user.phoneNumber;

    const orderRef = await admin.database().ref("orders/").push({
      name,
      phone1,
      phone2,
      uid,
      status: "pending",
      baskets: basketBrought.basketBrought,
      bill: fileName,
      products: productBrought.productBrought,
      timestamp: Date.now(),
      user: userData,
      paymentMethod: "local",
      bank,
    });

    return NextResponse.json({ orderId: orderRef.key });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

async function verifyBasketItems(
  basketCart: z.infer<typeof BasketItemSchema>[],
): Promise<{
  basketBrought: BasketItemData[];
  total: number;
}> {
  let total = 0;
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
  };
}

async function verifyProductItems(
  productCart: z.infer<typeof ProductItemSchema>[],
) {
  let total = 0;
  const productBrought: ProductItemData[] = [];

  for (let item of productCart) {
    if (item.qty == 0) continue;

    const productRef = await admin
      .firestore()
      .collection("products")
      .doc(item.productId)
      .get();

    if (!productRef.exists || !productRef.data()) continue;

    const product = productRef.data() as Product;

    productBrought.push({
      productId: item.productId,
      product,
      qty: item.qty,
    });
    total += product.price * item.qty;
  }

  return {
    productBrought,
    total,
  };
}
