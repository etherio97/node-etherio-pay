"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const router = (0, express_1.Router)();
router.post("/transfer", async (req, res) => {
    const senderId = req["uid"];
    const { recipientId, amount } = req.body;
    if (!recipientId || !amount) {
        return res.status(400).json({ error: "Bad request" });
    }
    try {
        const senderRef = (0, firebase_admin_1.database)().ref("accounts").child(senderId);
        const recipientRef = (0, firebase_admin_1.database)().ref("accounts").child(recipientId);
        const sender = (await senderRef.get()).toJSON();
        const recipient = (await recipientRef.get()).toJSON();
        if (sender.status !== "ACTIVE" || recipient.status !== "ACTIVE") {
            return res.status(403).json({ error: "inactive account" });
        }
        if (sender.balance < amount) {
            return res.status(403).json({ error: "insuffient balance" });
        }
        const transactionRef = (0, firebase_admin_1.database)().ref("transactions");
        const transaction = {
            senderId,
            recipientId,
            amount,
            senderBeforeTransfer: sender.balance,
            recipientBeforeTransfer: recipient.balance,
            senderAfterTransfer: sender.balance - amount,
            recipientAfterTransfer: recipient.balance + amount,
            createdAt: Date.now(),
        };
        await transactionRef.push(transaction);
        await senderRef.update({
            balance: transaction.senderAfterTransfer,
        });
        await recipientRef.update({
            balance: transaction.recipientAfterTransfer,
        });
        res.json({ message: "success" });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
