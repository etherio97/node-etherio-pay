import { Router } from "express";
import { guard } from "../middleware/guard";
import account from "./account";
import transfer from "./transfer";
import redeem from "./redeem";
import transaction from "./transaction";
import giftCards from "./gift-cards";

const router = Router();

router.use(guard);

// guarded routes
router.use("/account", account);

router.use("/transfer", transfer);

router.use("/transaction", transaction);

router.use("/redeem", redeem);

router.use("/gift-cards", giftCards);

export default router;
