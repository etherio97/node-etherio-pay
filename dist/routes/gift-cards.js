"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_admin_1 = require("firebase-admin");
const router = (0, express_1.Router)();
router.get('/all', (req, res) => {
    (0, firebase_admin_1.database)()
        .ref('giftCardPackages')
        .get()
        .then((snap) => {
        let result = Object.entries(snap.val() || []).map(([id, value]) => ({
            id,
            image: value.image,
            title: value.title,
        }));
        res.json(result);
    })
        .catch((e) => {
        res.status(500).json({ error: e.message });
    });
});
router.get('/:id', (req, res) => {
    (0, firebase_admin_1.database)()
        .ref('giftCards')
        .orderByChild('category')
        .equalTo(req.params.id)
        .get()
        .then((snap) => {
        let result = Object.entries(snap.val() || []).map(([id, value]) => ({
            id,
            image: value.image,
            category: value.category,
            price: value.price,
            title: value.title,
        }));
        res.json(result);
    })
        .catch((e) => {
        res.status(500).json({ error: e.message });
    });
});
exports.default = router;
