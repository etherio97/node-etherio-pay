import { Router } from "express";
import { guard } from "../middleware/guard";
import account from "./account";
import transfer from "./transfer";
import redeem from "./redeem";

const router = Router();

router.use("/account", guard, account);

router.use("/transfer", guard, transfer);

router.use("/redeem", guard, redeem);

export default router;
