import { Router } from "express";
import { database } from "firebase-admin";

const router = Router();

router.get("/transfered", async (req, res) => {
  try {
    const uid = req["uid"];
    const query = database()
      .ref("transactions")
      .orderByChild("senderId")
      .equalTo(uid);

    const transactions: Array<any> = Object.entries(
      (await query.get()).toJSON() || {}
    ).map(([ref, value]: [string, object]) => ({ ref, ...value }));

    res.json(transactions.reverse());
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/recieved", async (req, res) => {
  try {
    const uid = req["uid"];
    const query = database()
      .ref("transactions")
      .orderByChild("recipientId")
      .equalTo(uid);

    const transactions: Array<any> = Object.entries(
      (await query.get()).toJSON() || {}
    ).map(([ref, value]: [string, object]) => ({ ref, ...value }));

    res.json(transactions.reverse());
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
