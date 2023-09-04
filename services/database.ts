import { Basket, Contacts } from "@/utils/types";
import {
  query as dbQuery,
  equalTo,
  get,
  orderByChild,
  push,
  ref,
  set,
} from "firebase/database";
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

export async function getCatagories() {
  const catRef = await get(ref(rtdb, "catagories"));

  if (!catRef.exists() || !catRef.val()) return [];
  return Object.entries(catRef.val())
    .map(([k, v]) => ({
      id: k,
      name: (v as { name: string; count?: number }).name,
      count: (v as { name: string; count?: number }).count,
    }))
    .filter((item) => (item?.count ?? 0) > 0);
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
