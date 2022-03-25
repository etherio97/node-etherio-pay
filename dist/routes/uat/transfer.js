"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const _1 = require(".");
const router = (0, express_1.Router)();
router.post('/', async (req, res) => {
    let senderId = req['uid'];
    let { recipientId, amount, note } = req.body;
    amount = parseInt(amount) || 0;
    if (!recipientId) {
        return res
            .status(400)
            .json({ error: 'Account ID for recipient is required' });
    }
    if (recipientId !== _1.WHITELISTS[1].accountId) {
        return res.status(400).json({ error: 'Acocunt ID is not in whitelist' });
    }
    if (senderId == recipientId) {
        return res.status(400).json({ error: 'Cannot transfer to own account' });
    }
    if (!amount || typeof amount !== 'number' || amount < 0) {
        return res.status(400).json({ error: 'Invalid amount' }).end();
    }
    try {
        const senderRef = (0, firebase_admin_1.database)().ref('accounts').child(senderId);
        const recipientRef = (0, firebase_admin_1.database)().ref('accounts').child(recipientId);
        const transactionRef = (0, firebase_admin_1.database)().ref('transactions');
        const sender = (await senderRef.get()).toJSON();
        if (!sender) {
            return res.status(403).json({ error: 'Invalid account' });
        }
        if (sender.status !== 'ACTIVE') {
            return res.status(400).json({ error: 'Your account is inactive' });
        }
        const recipient = (await recipientRef.get()).toJSON();
        if (!recipient) {
            return res.status(400).json({ error: 'Recipient not found' });
        }
        if (recipient.status !== 'ACTIVE') {
            return res
                .status(400)
                .json({ error: 'You cannot transfer to inactive account' });
        }
        if (sender.balance < amount) {
            return res
                .status(400)
                .json({ error: 'Your account has insuffient balance' });
        }
        const transaction = {
            senderId,
            recipientId,
            amount,
            note: note || null,
            senderName: sender.identifier,
            recipientName: recipient.identifier,
            createdAt: Date.now(),
        };
        const transactionSnap = await transactionRef.push(transaction);
        await senderRef.update({
            balance: firebase_admin_1.database.ServerValue.increment(-amount),
        });
        await recipientRef.update({
            balance: firebase_admin_1.database.ServerValue.increment(amount),
        });
        res.json({ transactionId: transactionSnap.key });
        (0, firebase_admin_1.firestore)()
            .doc(['accounts', senderId].join('/'))
            .set({ action: 'balance', updated_at: Date.now() })
            .catch(() => null);
        (0, firebase_admin_1.firestore)()
            .doc(['accounts', recipientId].join('/'))
            .set({ action: 'balance', updated_at: Date.now() })
            .catch(() => null);
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
});
exports.default = router;
