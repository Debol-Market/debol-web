import { generateBasketKeywords, generateProductKeywords } from "@/utils/misc";
import { Basket, Catagory, Contacts, Product, Vendor } from "@/utils/types";
import {
  query as dbQuery,
  equalTo,
  get,
  orderByChild,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, rtdb } from "./firebase";

export const getBaskets = async () => {
  const baskets = await get(ref(rtdb, "baskets"));
  return Object.entries(baskets.val()).map(([basketId, basket]) => ({
    id: basketId,
    ...(basket as Basket),
  }));
};

export async function getBasket(basketId: string) {
  const snap = await get(ref(rtdb, `/baskets/${basketId}`));

  if (!snap.val()) return;
  return { ...(snap.val() as Basket), id: basketId };
}

export async function getBasketsByKeyword(keyword: string[]) {
  const baskets = await getDocs(
    query(
      collection(firestore, "baskets"),
      where("keywords", "array-contains-any", keyword)
    )
  );
  const basketsData = baskets.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Basket & { keyword: string[] }),
  }));
  return basketsData;
}

export async function getCatagories() {
  const catRef = await get(ref(rtdb, "catagories"));

  if (!catRef.exists() || !catRef.val()) return [];
  return Object.entries(catRef.val()).map(([k, v]) => ({
    id: k,
    ...(v as Catagory),
  }));
}

export async function getBasketsByCatagory(name: string) {
  const baskets = await get(
    dbQuery(ref(rtdb, "baskets"), orderByChild("catagory"), equalTo(name))
  );

  if (!baskets.exists() || !baskets.val()) return [];

  return Object.entries(baskets.val()).map(([k, v]) => ({
    id: k,
    ...(v as Basket),
  }));
}

export const createContact = async (contacts: Contacts) => {
  const contactsRef = push(ref(rtdb, "contacts"));
  return set(contactsRef, contacts);
};

export async function getCurrencyMulti(currency: string) {
  const res = await fetch("/api/get-currencies");
  const currencies = await res.json();

  const usd = currencies.rates.USD;

  return currencies.rates[currency] / usd;
}

export async function CreateCatagory(catagoryName: string) {
  const catagoryRef = push(ref(rtdb, "catagories"));

  await set(catagoryRef, {
    name: catagoryName,
    basketCount: 0,
    productCount: 0,
  } as Catagory);
  return catagoryRef;
}

export const createBasket = async (basket: Basket) => {
  const basketRef = push(ref(rtdb, "baskets"));
  if (basketRef.key == null) throw new Error("Could not create basket");

  setDoc(doc(firestore, `baskets`, basketRef.key), {
    ...basket,
    keywords: generateBasketKeywords(basket),
  });

  if (basket.catagory) {
    const catRef = await get(
      dbQuery(
        ref(rtdb, "catagories"),
        orderByChild("name"),
        equalTo(basket.catagory)
      )
    );
    if (catRef.exists() && catRef.val())
      update(ref(rtdb, "catagories/" + catRef.key), {
        count: (catRef.val()?.count ?? 0) + 1,
      });
  }
  return set(basketRef, basket);
};

export const updateCatagoryBasketCountById = async (
  id: string,
  value: number
) => {
  const catRef = ref(rtdb, `catagories/${id}`);
  const catData = await get(catRef);

  if (!catData.exists || !catData.val()) return;

  await update(catRef, { basketCount: catData.val().basketCount + value });
};

export const updateCatagoryProductCountById = async (
  id: string,
  value: number
) => {
  const catRef = ref(rtdb, `catagories/${id}`);
  const catData = await get(catRef);

  if (!catData.exists || !catData.val()) return;

  await update(catRef, { productCount: catData.val().productCount + value });
};

export const updateBasket = async (basket: Basket, basketId: string) => {
  await Promise.all([
    update(ref(rtdb, "baskets/" + basketId), basket),
    updateDoc(doc(firestore, "baskets", basketId), {
      ...basket,
      keywords: generateBasketKeywords(basket),
    }),
  ]);
};

export const deleteBasket = async (basketId: string) => {
  const basket = await get(ref(rtdb, `baskets/${basketId}`));

  if (basket.val().catagory) {
    const catRef = await get(
      dbQuery(
        ref(rtdb, "catagories"),
        orderByChild("name"),
        equalTo(basket.val().catagory)
      )
    );
    if (catRef.exists() && catRef.val()) {
      if (catRef.val().count)
        update(ref(rtdb, "catagories/" + catRef.key), {
          count: (catRef.val()?.count ?? 0) - 1,
        });
    }
  }

  await Promise.all([
    remove(ref(rtdb, "baskets/" + basketId)),
    deleteDoc(doc(firestore, "baskets", basketId)),
  ]);
};

export const getProduct = async (productId: string) => {
  const snap = await get(ref(rtdb, `/products/${productId}`));

  if (!snap.val()) return;
  return { ...(snap.val() as Product), id: productId };
};

export const deleteProduct = async (productId: string) => {
  const product = await get(ref(rtdb, `products/${productId}`));

  if (product.val().catagory) {
    const catRef = await get(
      dbQuery(
        ref(rtdb, "catagories"),
        orderByChild("name"),
        equalTo(product.val().catagory)
      )
    );
    if (catRef.exists() && catRef.val()) {
      if (catRef.val().count)
        update(ref(rtdb, "catagories/" + catRef.key), {
          count: (catRef.val()?.count ?? 0) - 1,
        });
    }
  }
};

export const updateProduct = async (product: Product, productId: string) => {
  await Promise.all([
    update(ref(rtdb, "products/" + productId), product),
    updateDoc(doc(firestore, "products", productId), {
      ...product,
      keywords: generateProductKeywords(product),
    }),
  ]);
};

export const createProduct = async (product: Product) => {
  const productRef = push(ref(rtdb, "products"));
  if (productRef.key == null) throw new Error("Could not create product");

  setDoc(doc(firestore, `products`, productRef.key), {
    ...product,
    keywords: generateProductKeywords(product),
  });

  set(productRef, product);
  return productRef;
};

export const createVendor = async (vendor: Vendor) => {
  const vendorRef = push(ref(rtdb, "vendors"));
  if (vendorRef.key == null) throw new Error("Could not create vendor");
  await set(vendorRef, vendor);
  return vendorRef;
};

export const getVendors = async () => {
  const vendors = await get(ref(rtdb, "vendors"));
  if (!vendors.exists() || !vendors.val()) return [];
  return Object.entries(vendors.val()).map(([vendorId, vendor]) => ({
    id: vendorId,
    ...(vendor as Vendor),
  }));
};
