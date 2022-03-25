import * as admin from "firebase-admin";
import { FIREBASE_DATABASE_URL } from "../config";

if (admin.apps.length === 0) {
  const serviceAccount = require("../../serviceAccount.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}
