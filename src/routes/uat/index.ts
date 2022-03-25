import { Router } from 'express';
import account from './account';
import transfer from './transfer';
import redeem from './redeem';
import transaction from './transaction';
import giftCards from './gift-cards';

export const WHITELISTS = [
  {
    uid: 'NJcEavlvB1dWR4ERLdwqN46NQRj1',
    phoneNumber: '+9598484834',
    accountId: 'NJcEavlvB1dWR4ERLdwqN46NQRj1',
  },
  {
    uid: 'wWgoAzrqh7WqBstTVX3RkRbebGY2',
    phoneNumber: '+9598383834',
    accountId: 'wWgoAzrqh7WqBstTVX3RkRbebGY2',
  },
];

const guard = (req, res, next) => {
  req['auth'] = WHITELISTS[0];
  req['uid'] = req['auth'].uid;
  next();
};

const router = Router();

router.use('/account', guard, account);

router.use('/transfer', guard, transfer);

router.use('/transaction', guard, transaction);

router.use('/redeem', guard, redeem);

router.use('/gift-cards', guard, giftCards);

export default router;
