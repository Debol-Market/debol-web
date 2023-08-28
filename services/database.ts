import { Basket } from "@/utils/types";
import { get, ref } from "firebase/database";
import { collection, getDocs, query, where } from "firebase/firestore";
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
