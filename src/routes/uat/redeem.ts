import { Router } from "express";
import { database } from "firebase-admin";
import { v4 } from "uuid";
import moment from "moment";

const router = Router();

router.post("/create", async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    return res.status(400).json({ error: "Bad request" });
  }
  try {
    const code = v4();
    const expired = moment().add(1, "month").toDate().getTime();
    const redeem = { amount, expired, isUsed: false, createdAt: Date.now() };
    await database()
      .ref("redeemCards")
      .update({
        [code]: redeem,
      });
    res.json(code);
  } catch (e) {
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
    const accountRef = database().ref("accounts").child(req["uid"]);
    const redeemRef = database().ref("redeemCards").child(redeemCode);
    const account: any = (await accountRef.get()).toJSON();
    if (!account) {
      return res.status(400).json({ error: "invalid account" });
    }
    if (account.status !== "ACTIVE") {
      return res.status(400).json({ error: "inactive account" });
    }
    const redeem: any = (await redeemRef.get()).toJSON();
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
      balance: database.ServerValue.increment(redeem.amount),
    });
    res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
