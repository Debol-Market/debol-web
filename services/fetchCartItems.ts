import { BasketItem, Product, ProductItem } from "@/utils/types";
import { getBasket } from "./database";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export function fetchBasketsItems(items: BasketItem[]) {
  return Promise.all(items.map((item) => getBasket(item.basketId)));
}

export function fetchProdcuctItems(items: ProductItem[]) {
  return Promise.all(
    items.map(async (item) => {
      const docRef = await getDoc(doc(firestore, item.productId));
      return docRef.exists()
        ? ({ ...docRef.data(), id: docRef.id } as Product)
        : undefined;
    }),
  );
}
