import { BasketItem, Product, ProductItem } from "@/utils/types";
import { getBasket } from "./database";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "./firebase";

export function fetchBasketsItems(items: BasketItem[]) {
  return Promise.all(
    items.map(async (item) => {
      try {
        return await getBasket(item.basketId);
      } catch (error) {
        return;
      }
    }),
  );
}

export function fetchProductItems(items: ProductItem[]) {
  return Promise.all(
    items.map(async (item) => {
      const docRef = await getDoc(doc(firestore, "products", item.productId));
      return docRef.exists()
        ? ({ ...docRef.data(), id: docRef.id } as Product)
        : undefined;
    }),
  );
}
