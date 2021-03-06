import { Router } from 'express';
import { database } from 'firebase-admin';

const router = Router();

router.get('/all', (req, res) => {
  database()
    .ref('giftCardPackages')
    .get()
    .then((snap) => {
      let result: any = Object.entries(snap.val() || []).map(
        ([id, value]: [string, any]) => ({
          id,
          image: value.image,
          title: value.title,
        })
      );
      res.json(result);
    })
    .catch((e) => {
      res.status(500).json({ error: e.message });
    });
});

router.get('/:id', (req, res) => {
  database()
    .ref('giftCards')
    .orderByChild('category')
    .equalTo(req.params.id)
    .get()
    .then((snap) => {
      let result: any = Object.entries(snap.val() || []).map(
        ([id, value]: [string, any]) => ({
          id,
          image: value.image,
          category: value.category,
          price: value.price,
          title: value.title,
        })
      );
      res.json(result);
    })
    .catch((e) => {
      res.status(500).json({ error: e.message });
    });
});

export default router;
