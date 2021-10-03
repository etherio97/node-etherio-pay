import * as admin from "firebase-admin";
import { FIREBASE_DATABASE_URL } from "../config";

let app: any;

if (admin.apps.length === 0) {
  const serviceAccount = require("../../serviceAccount.json");

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL,
  });
}
