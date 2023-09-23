import {
  StorageReference,
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "./firebase";

export async function getUrl(path: string) {
  return getDownloadURL(ref(storage, path));
}

export const uploadBasketImage = async (
  basketId: string,
  basketSizes: string[],
  images: File[]
) => {
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const storageRef = ref(
      storage,
      `products/baskets/${basketId}/${basketSizes[i]}.jpg`
    );
    await uploadBytes(storageRef, file, { contentType: "image/jpeg" });
  }
};

export const uploadProductImages = async (
  productId: string,
  images: File[]
) => {
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const storageRef = ref(storage, `products/${productId}/${i}.jpg`);
    await uploadBytes(storageRef, file, { contentType: "image/jpeg" });
  }
};

export const updateBasketImage = async (
  basketId: string,
  basketSizes: string[],
  images: File[]
) => {
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    const storageRef = ref(
      storage,
      `products/baskets/${basketId}/${basketSizes[i]}.jpg`
    );
    await uploadBytes(storageRef, file, { contentType: "image/jpeg" });
  }
};

export const deleteBasketImages = async (basketId: string) => {
  const storageRef = ref(storage, `products/baskets/${basketId}`);
  await deleteObject(storageRef);
};

export const deleteItemImages = async (itemId: string) => {
  const storageRef = ref(storage, `products/items/${itemId}`);
  await deleteObject(storageRef);
};

export const getDefaultBasketImages = async () => {
  const storageRef = ref(storage, "baskets/default/");
  const imagesRefs = await listAll(storageRef);

  return imagesRefs.items;
};

export const getImageUrl = async (ref: StorageReference) => {
  const url = await getDownloadURL(ref);
  return url;
};
