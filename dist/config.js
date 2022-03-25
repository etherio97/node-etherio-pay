"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FIREBASE_DATABASE_URL = exports.PORT = void 0;
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
exports.PORT = process.env.PORT || 3000;
exports.FIREBASE_DATABASE_URL = process.env.FIREBASE_DATABASE_URL;
