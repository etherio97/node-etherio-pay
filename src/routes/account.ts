import { Router } from "express";
import { database } from "firebase-admin";

const router = Router();

router.post("/identify", async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) {
    return res.status(400).json({ error: "bad request" });
  }
  try {
    const query = database()
      .ref("accounts")
      .orderByChild("identifier")
      .equalTo(identifier)
      .limitToLast(1);
    const data = await (await query.get()).toJSON();
    const accounts = Object.keys(data || {});

    res.json(accounts);
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (req, res) => {
  const uid = req["uid"];
  const auth = req["auth"];
  const accountRef = database().ref("accounts").child(uid);
  try {
    const account = await (await accountRef.get()).toJSON();
    if (!account) {
      return res.json({
        uid,
        identifier: auth["phone_number"] || auth["email"],
        balance: null,
        status: "ACTIVE",
        createdAt: auth["created_at"],
      });
    }
    res.json(account);
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  const uid = req["uid"];
  const auth = req["auth"];
  const accountRef = database().ref("accounts").child(uid);
  try {
    const accountSnap = await accountRef.get();
    if (accountSnap.exists()) {
      return res.status(400).json({ error: "already exists" });
    }
    const account = {
      uid,
      identifier: auth["phone_number"] || auth["email"],
      balance: 0,
      status: "ACTIVE",
      createdAt: Date.now(),
    };
    await accountRef.set(account);
    res.send(account);
  } catch (e) {
    // console.error(e);
    res.json({ error: e.message });
  }
});

export default router;
