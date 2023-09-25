// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { attachCustomCommands } from "cypress-firebase";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const fbConfig = {
  apiKey: "AIzaSyDveSpCYo90F_uDGC-GHWXutLnsxMN3JhI",
  authDomain: "debolpackages.firebaseapp.com",
  databaseURL: "https://debolpackages-default-rtdb.firebaseio.com",
  projectId: "debolpackages",
  storageBucket: "debolpackages.appspot.com",
  messagingSenderId: "335399171005",
  appId: "1:335399171005:web:e2b047874b10c001b818d4",
  measurementId: "G-4TWEKYV5EF",
};
const ip = process.env.NEXT_PUBLIC_LOCAL_IP ?? "localhost";
// connectAuthEmulator(auth, `http://${ip}:9099`);
// connectStorageEmulator(storage, ip, 9199);
// connectFirestoreEmulator(firestore, ip, 8080);
// connectDatabaseEmulator(rtdb, ip, 9000);

// Emulate RTDB if Env variable is passed
const rtdbEmulatorHost = Cypress.env("FIREBASE_DATABASE_EMULATOR_HOST");
fbConfig.databaseURL = `http://${rtdbEmulatorHost}?ns=${fbConfig.projectId}`;

const app = firebase.initializeApp(fbConfig);
export default app;

// Emulate Firestore if Env variable is passed
const firestoreEmulatorHost = Cypress.env("FIREBASE_FIRESTORE_EMULATOR_HOST");
if (firestoreEmulatorHost)
  firebase.firestore().settings({
    host: firestoreEmulatorHost,
    ssl: false,
  });

const authEmulatorHost = Cypress.env("FIREBASE_AUTH_EMULATOR_HOST");
firebase.auth().useEmulator(`http://${authEmulatorHost}/`);
console.debug(`Using Auth emulator: http://${authEmulatorHost}/`);

// const storageEmulatorHost = process.env.FIREBASE_STORAGE_EMULATOR_HOST;
// firebase.storage().useEmulator("localhost", 9199);

attachCustomCommands({ Cypress, cy, firebase });
