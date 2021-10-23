#!/usr/bin/env node
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { default: axios } = require("axios");
const { join, basename } = require("path");
const { writeFileSync, existsSync } = require("fs");

const SERVICE_ACCOUNT_PATH = join(__dirname, "../serviceAccount.json");
const FIREBASE_CREDENTIAL_URL = process.env.FIREBASE_CREDENTIAL_URL;

if (!FIREBASE_CREDENTIAL_URL) throw "env: FIREBASE_CREDENTIAL_URL is undefined";

if (existsSync(SERVICE_ACCOUNT_PATH)) {
  console.log(
    "%s is already existed in your root directory",
    basename(SERVICE_ACCOUNT_PATH)
  );
  process.exit(0);
}

axios.get(FIREBASE_CREDENTIAL_URL).then(({ data }) => {
  writeFileSync(SERVICE_ACCOUNT_PATH, JSON.stringify(data), "utf-8");
});
