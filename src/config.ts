if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

export const PORT = process.env.PORT || 3000;

export const FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
