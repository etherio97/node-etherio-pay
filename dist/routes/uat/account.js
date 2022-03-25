"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const router = (0, express_1.Router)();
router.post("/identify", async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
        return res.status(400).json({ error: "bad request" });
    }
    try {
        const query = (0, firebase_admin_1.database)()
            .ref("accounts")
            .orderByChild("identifier")
            .equalTo(identifier)
            .limitToLast(1);
        const data = await (await query.get()).toJSON();
        const accounts = Object.keys(data || {});
        res.json(accounts);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get("/", async (req, res) => {
    const uid = req["uid"];
    const auth = req["auth"];
    const accountRef = (0, firebase_admin_1.database)().ref("accounts").child(uid);
    try {
        const account = await (await accountRef.get()).toJSON();
        if (!account) {
            return res.json({
                uid,
                identifier: auth["phone_number"] || auth["email"],
                balance: null,
                status: "ACTIVE",
                createdAt: auth["created_at"],
            });
        }
        res.json(account);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.post("/", async (req, res) => {
    const uid = req["uid"];
    const auth = req["auth"];
    const accountRef = (0, firebase_admin_1.database)().ref("accounts").child(uid);
    try {
        const accountSnap = await accountRef.get();
        if (accountSnap.exists()) {
            return res.status(400).json({ error: "already exists" });
        }
        const account = {
            uid,
            identifier: auth["phone_number"] || auth["email"],
            balance: 0,
            status: "ACTIVE",
            createdAt: Date.now(),
        };
        await accountRef.set(account);
        res.send(account);
    }
    catch (e) {
        res.json({ error: e.message });
    }
});
exports.default = router;
