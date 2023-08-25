import admin from "firebase-admin";

const config = {
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT ?? "")
  ),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};
function init() {
  try {
    return admin.initializeApp(config);
  } catch (any) {
    return admin.app();
  }
}

export default init();
