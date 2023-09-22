import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectDatabaseEmulator, getDatabase } from "firebase/database";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDveSpCYo90F_uDGC-GHWXutLnsxMN3JhI",
  authDomain: "debolpackages.firebaseapp.com",
  databaseURL: "https://debolpackages-default-rtdb.firebaseio.com",
  projectId: "debolpackages",
  storageBucket: "debolpackages.appspot.com",
  messagingSenderId: "335399171005",
  appId: "1:335399171005:web:e2b047874b10c001b818d4",
  measurementId: "G-4TWEKYV5EF",
};

const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
auth.languageCode = "en";
export const rtdb = getDatabase(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

const EMULATORS_STARTED = "EMULATORS_STARTED";
function startEmulators() {
  if (!(global as any)[EMULATORS_STARTED]) {
    (global as any)[EMULATORS_STARTED] = true;
    const ip = process.env.NEXT_PUBLIC_LOCAL_IP ?? "localhost";
    connectAuthEmulator(auth, `http://${ip}:9099`);
    connectStorageEmulator(storage, ip, 9199);
    connectFirestoreEmulator(firestore, ip, 8080);
    connectDatabaseEmulator(rtdb, ip, 9000);
  }
}

if (
  (!isBrowser && process.env.NODE_ENV == "development") ||
  (isBrowser && location?.hostname == "localhost")
)
  startEmulators();
