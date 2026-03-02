import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { roleGuard } from '../middleware/role-guard.js';
import * as balanceController from '../controllers/balance.controller.js';

export const balanceRoutes = Router();

balanceRoutes.use(authMiddleware);

balanceRoutes.get('/', balanceController.getMyBalances);
balanceRoutes.get('/:userId', roleGuard('manager', 'admin'), balanceController.getUserBalances);
