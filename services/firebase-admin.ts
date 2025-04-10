import admin from "firebase-admin";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ?? "";

function init() {
  try {
    return admin.initializeApp(
      serviceAccount
        ? {
          credential: serviceAccount
            ? admin.credential.cert(JSON.parse(serviceAccount))
            : undefined,
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        }
        : {
          databaseURL: process.env.FIREBASE_DATABASE_URL,
        },
    );
  } catch (e) {
    console.log(e);
    return admin.app();
  }
}

export default init();
