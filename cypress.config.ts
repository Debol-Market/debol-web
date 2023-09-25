import { defineConfig } from "cypress";
import { plugin as cypressFirebasePlugin } from "cypress-firebase";
import admin from "firebase-admin";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    env: {
      FIREBASE_STORAGE_EMULATOR_HOST: "0.0.0.0:9199",
      FIREBASE_AUTH_EMULATOR_HOST: "0.0.0.0:9099",
      FIREBASE_DATABASE_EMULATOR_HOST: "0.0.0.0:9000",
    },
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return cypressFirebasePlugin(on, config, admin, {
        projectId: "debolpackages",
        databaseURL: "https://debolpackages-default-rtdb.firebaseio.com",
      });
    },
  },
});
