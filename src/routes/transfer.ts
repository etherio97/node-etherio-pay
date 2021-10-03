import { Router } from "express";
import { database } from "firebase-admin";

const router = Router();

router.post("/", async (req, res) => {
  const senderId = req["uid"];
  const { recipientId, amount } = req.body;
  if (!recipientId || !amount) {
    return res.status(400).json({ error: "Bad request" });
  }
  try {
    const senderRef = database().ref("accounts").child(senderId);
    const recipientRef = database().ref("accounts").child(recipientId);
    const sender: any = (await senderRef.get()).toJSON();
    const recipient: any = (await recipientRef.get()).toJSON();
    if (sender.status !== "ACTIVE" || recipient.status !== "ACTIVE") {
      return res.status(403).json({ error: "inactive account" });
    }
    if (sender.balance < amount) {
      return res.status(403).json({ error: "insuffient balance" });
    }
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
    await transactionRef.push(transaction);
    await senderRef.update({
      balance: transaction.senderAfterTransfer,
    });
    await recipientRef.update({
      balance: transaction.recipientAfterTransfer,
    });
    res.json({ message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
