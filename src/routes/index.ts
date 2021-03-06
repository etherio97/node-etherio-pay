import { Router } from 'express';
import { guard } from '../middleware/guard';
import uat from './uat';
import account from './account';
import transfer from './transfer';
import redeem from './redeem';
import transaction from './transaction';
import giftCards from './gift-cards';

const router = Router();

router.use('/uat', uat);

router.use('/account', guard, account);

router.use('/transfer', guard, transfer);

router.use('/transaction', guard, transaction);

router.use('/redeem', guard, redeem);

router.use('/gift-cards', guard, giftCards);

export default router;
