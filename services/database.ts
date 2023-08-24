import { Basket } from "@/utils/types";
import { get, ref } from "firebase/database";
import { rtdb } from "./firebase";

export const getBaskets = async () => {
  const baskets = await get(ref(rtdb, "baskets"));
  return Object.entries(baskets.val()).map(([basketId, basket]) => ({
    id: basketId,
    ...(basket as Basket),
  }));
};

export async function getBasket(basketId: string) {
  const snap = await get(ref(rtdb, `/baskets/${basketId}`));

  return { ...(snap.val() as Basket), id: basketId };
}
