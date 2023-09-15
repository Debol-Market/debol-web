import { auth } from "@/services/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithRedirect
} from "firebase/auth";

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  return await signInWithRedirect(auth, provider);
}

export async function logout() {
  return await auth.signOut();
}

export async function login(email: string, password: string) {
  return await signInWithEmailAndPassword(auth, email, password);
}