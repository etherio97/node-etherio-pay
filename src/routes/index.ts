import { Router } from "express";
import { guard } from "../middleware/guard";
import account from "./account";
import transfer from "./transfer";
import redeem from "./redeem";
import transaction from "./transaction";
import giftCards from "./gift-cards";

const router = Router();

router.use(guard);

// router.use((req, res, next) => {
//   req["uid"] = "TJFsHJ3Z0YXv4rvlK25yCKWYDTa3";
//   req["auth"] = {
//     uid: req["uid"],
//     phone_number: "+959786790788",
//     email: null,
//     created_at: 1634813766848,
//   };
//   next();
// });

// guarded routes
router.use("/account", account);

router.use("/transfer", transfer);

router.use("/transaction", transaction);

router.use("/redeem", redeem);

router.use("/gift-cards", giftCards);

export default router;
