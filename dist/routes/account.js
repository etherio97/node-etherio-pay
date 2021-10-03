"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    const uid = req["uid"];
    const accountRef = (0, firebase_admin_1.database)().ref("accounts").child(uid);
    try {
        const account = await accountRef.get();
        res.json(account);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
