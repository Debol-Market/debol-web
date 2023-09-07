import { auth } from "@/services/firebase";
import {
  GoogleAuthProvider,
  signInWithRedirect
} from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  return await signInWithRedirect(auth, provider);
}

export async function logout() {
  return await auth.signOut();
}
