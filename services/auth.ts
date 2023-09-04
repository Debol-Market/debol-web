import { auth } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  return await signInWithPopup(auth, provider);
}

export async function logout() {
  return await auth.signOut();
}
