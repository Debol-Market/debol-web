import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "./firebase";

export async function getUrl(path: string) {
  return getDownloadURL(ref(storage, path));
}
