import { Router } from "express";
import { database, firestore } from "firebase-admin";
import moment from "moment-timezone";
import queueToSendMessage from "../functions/queueToSendMessage";

const router = Router();

router.post("/", async (req, res) => {
  let senderId = req["uid"];
  let { recipientId, amount } = req.body;
  amount = parseInt(amount) || 0;

  if (!recipientId) {
    return res
      .status(400)
      .json({ error: "Account ID for recipient is required" });
  }

  if (senderId == recipientId) {
    return res.status(400).json({ error: "Cannot transfer to own account" });
  }

  if (!amount || typeof amount !== "number" || amount < 0) {
    return res.status(400).json({ error: "Invalid amount" }).end();
  }

  try {
    const senderRef = database().ref("accounts").child(senderId);
    const recipientRef = database().ref("accounts").child(recipientId);
    const transactionRef = database().ref("transactions");
    const time = moment().tz("Asia/Rangoon").format("DD/MM/YYYY hh:mmA");

    const sender: any = (await senderRef.get()).toJSON();
    if (!sender) {
      return res.status(403).json({ error: "Invalid account" });
    }

    if (sender.status !== "ACTIVE") {
      return res.status(400).json({ error: "Your account is inactive" });
    }

    const recipient: any = (await recipientRef.get()).toJSON();
    if (!recipient) {
      return res.status(400).json({ error: "Recipient not found" });
    }

    if (recipient.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ error: "You cannot transfer to inactive account" });
    }

    if (sender.balance < amount) {
      return res
        .status(400)
        .json({ error: "Your account has insuffient balance" });
    }

    const transaction = {
      senderId,
      recipientId,
      amount,
      // senderBeforeTransfer: sender.balance,
      // recipientBeforeTransfer: recipient.balance,
      // senderAfterTransfer: sender.balance - amount,
      // recipientAfterTransfer: recipient.balance + amount,
      senderName: sender.identifier,
      recipientName: recipient.identifier,
      createdAt: Date.now(),
    };

    const transactionSnap = await transactionRef.push(transaction);

    await senderRef.update({
      balance: database.ServerValue.increment(-amount),
    });

    await recipientRef.update({
      balance: database.ServerValue.increment(amount),
    });

    res.json({ transactionId: transactionSnap.key });

    await firestore()
      .doc(["accounts", recipient.identifier].join("/"))
      .set({})
      .then(() =>
        firestore()
          .doc(["accounts", recipient.identifier].join("/"))
          .set({ action: "balance" })
      )
      .catch(() => null);

    await queueToSendMessage(
      recipient.identifier,
      `You recieved ${amount.toLocaleString()} kyats from ${
        sender.identifier
      } at ${time}. -EtherioPay [Ref:${transactionSnap.key}]`
    );
  } catch (e) {
    // console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
