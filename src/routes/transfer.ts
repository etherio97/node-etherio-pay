import { Router } from "express";
import { database } from "firebase-admin";

const router = Router();

router.post("/", async (req, res) => {
  const senderId = req["uid"];
  const { recipientId, amount } = req.body;
  if (
    !recipientId ||
    senderId == recipientId ||
    !amount ||
    typeof amount !== "number" ||
    amount < 0
  ) {
    return res.status(400).json({ error: "Bad request" });
  }
  try {
    const senderRef = database().ref("accounts").child(senderId);
    const recipientRef = database().ref("accounts").child(recipientId);
    const sender: any = (await senderRef.get()).toJSON();
    const recipient: any = (await recipientRef.get()).toJSON();
    if (!sender || !recipient) {
      return res.status(400).json({ error: "invalid account" });
    }
    if (sender.status !== "ACTIVE" || recipient.status !== "ACTIVE") {
      return res.status(400).json({ error: "inactive account" });
    }
    if (sender.balance < amount) {
      return res.status(400).json({ error: "insuffient balance" });
    }
    await senderRef.update({ status: "IN_TRANS" });
    const transactionRef = database().ref("transactions");
    const transaction = {
      senderId,
      recipientId,
      amount,
      senderBeforeTransfer: sender.balance,
      recipientBeforeTransfer: recipient.balance,
      senderAfterTransfer: sender.balance - amount,
      recipientAfterTransfer: recipient.balance + amount,
      createdAt: Date.now(),
    };
    const dbRefUrl = await transactionRef.push(transaction);
    await senderRef.update({
      balance: database.ServerValue.increment(-amount),
      status: "ACTIVE",
    });
    await recipientRef.update({
      balance: database.ServerValue.increment(amount),
    });
    res.json({ transactionId: String(dbRefUrl).split("/").pop() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
