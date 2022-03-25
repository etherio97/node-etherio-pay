"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITELISTS = void 0;
const express_1 = require("express");
const account_1 = __importDefault(require("./account"));
const transfer_1 = __importDefault(require("./transfer"));
const redeem_1 = __importDefault(require("./redeem"));
const transaction_1 = __importDefault(require("./transaction"));
const gift_cards_1 = __importDefault(require("./gift-cards"));
exports.WHITELISTS = [
    {
        uid: 'NJcEavlvB1dWR4ERLdwqN46NQRj1',
        phoneNumber: '+9598484834',
        accountId: 'NJcEavlvB1dWR4ERLdwqN46NQRj1',
    },
    {
        uid: 'wWgoAzrqh7WqBstTVX3RkRbebGY2',
        phoneNumber: '+9598383834',
        accountId: 'wWgoAzrqh7WqBstTVX3RkRbebGY2',
    },
];
const guard = (req, res, next) => {
    req['auth'] = exports.WHITELISTS[0];
    req['uid'] = req['auth'].uid;
    next();
};
const router = (0, express_1.Router)();
router.use('/account', guard, account_1.default);
router.use('/transfer', guard, transfer_1.default);
router.use('/transaction', guard, transaction_1.default);
router.use('/redeem', guard, redeem_1.default);
router.use('/gift-cards', guard, gift_cards_1.default);
exports.default = router;
