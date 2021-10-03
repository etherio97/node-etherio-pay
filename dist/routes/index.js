"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const guard_1 = require("../middleware/guard");
const account_1 = __importDefault(require("./account"));
const transfer_1 = __importDefault(require("./transfer"));
const redeem_1 = __importDefault(require("./redeem"));
const router = (0, express_1.Router)();
router.use("/account", guard_1.guard, account_1.default);
router.use("/transfer", guard_1.guard, transfer_1.default);
router.use("/redeem", guard_1.guard, redeem_1.default);
exports.default = router;
