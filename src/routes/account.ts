import { Router } from "express";
import { database } from "firebase-admin";

const router = Router();

router.get("/", async (req, res) => {
  const uid = req["uid"];
  const accountRef = database().ref("accounts").child(uid);
  try {
    const account = await accountRef.get();
    res.json(account);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
