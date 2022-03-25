"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const router = (0, express_1.Router)();
router.post("/create", async (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({ error: "Bad request" });
    }
    try {
        const code = (0, uuid_1.v4)();
        const expired = (0, moment_1.default)().add(1, "month").toDate().getTime();
        const redeem = { amount, expired, isUsed: false, createdAt: Date.now() };
        await (0, firebase_admin_1.database)()
            .ref("redeemCards")
            .update({
            [code]: redeem,
        });
        res.json(code);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});
router.post("/", async (req, res) => {
    const { redeemCode } = req.body;
    if (!redeemCode) {
        return res.status(400).json({ error: "Bad request" });
    }
    try {
        const accountRef = (0, firebase_admin_1.database)().ref("accounts").child(req["uid"]);
        const redeemRef = (0, firebase_admin_1.database)().ref("redeemCards").child(redeemCode);
        const account = (await accountRef.get()).toJSON();
        if (!account) {
            return res.status(400).json({ error: "invalid account" });
        }
        if (account.status !== "ACTIVE") {
            return res.status(400).json({ error: "inactive account" });
        }
        const redeem = (await redeemRef.get()).toJSON();
        if (!redeem) {
            return res.status(400).json({ error: "invalid redeem code" });
        }
        if (redeem.isUsed) {
            return res.status(400).json({ error: "redeem code is already used" });
        }
        if (redeem.expired < Date.now()) {
            return res.status(400).json({ error: "redeem code is expired" });
        }
        await redeemRef.update({ isUsed: req["uid"], updatedAt: Date.now() });
        await accountRef.update({
            balance: firebase_admin_1.database.ServerValue.increment(redeem.amount),
        });
        res.json({ message: "success" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
