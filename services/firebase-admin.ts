import admin from "firebase-admin";

const config: admin.AppOptions = {
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? ""),
  ),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: "debolpackages.appspot.com",
};
function init() {
  try {
    return admin.initializeApp(config);
  } catch (any) {
    return admin.app();
  }
}

export default init();
