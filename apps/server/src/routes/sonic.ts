import { Router } from 'express';
import { sonicController } from '../controllers';

export const sonicRoutes = () => {
  const router = Router();
  router.post('/portfolio', sonicController.getWalletTokenPortfolio);
  return router;
};
