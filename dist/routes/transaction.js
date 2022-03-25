"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const router = (0, express_1.Router)();
router.get('/transfered', async (req, res) => {
    try {
        const uid = req['uid'];
        const query = (0, firebase_admin_1.database)()
            .ref('transactions')
            .orderByChild('senderId')
            .equalTo(uid);
        const transactions = Object.entries((await query.get()).toJSON() || {}).map(([id, value]) => ({
            id,
            amount: value.amount,
            createdAt: value.createdAt,
            recipientId: value.recipientId,
            recipientName: value.recipientName,
            senderId: value.senderId,
            senderName: value.senderName,
            note: value.note || null,
        }));
        res.json(transactions.reverse());
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
router.get('/recieved', async (req, res) => {
    try {
        const uid = req['uid'];
        const query = (0, firebase_admin_1.database)()
            .ref('transactions')
            .orderByChild('recipientId')
            .equalTo(uid);
        const transactions = Object.entries((await query.get()).toJSON() || {}).map(([id, value]) => ({
            id,
            amount: value.amount,
            createdAt: value.createdAt,
            recipientId: value.recipientId,
            recipientName: value.recipientName,
            senderId: value.senderId,
            senderName: value.senderName,
            note: value.note || null,
        }));
        res.json(transactions.reverse());
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
