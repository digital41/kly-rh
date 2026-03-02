import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { roleGuard } from '../middleware/role-guard.js';
import * as leaveController from '../controllers/leave.controller.js';

export const leaveRoutes = Router();

leaveRoutes.use(authMiddleware);

leaveRoutes.get('/', leaveController.getUserLeaves);
leaveRoutes.post('/', leaveController.createLeave);
leaveRoutes.get('/pending', roleGuard('manager', 'admin'), leaveController.getPendingLeaves);
leaveRoutes.put('/:id/approve', roleGuard('manager', 'admin'), leaveController.approveLeave);
leaveRoutes.put('/:id/reject', roleGuard('manager', 'admin'), leaveController.rejectLeave);
leaveRoutes.put('/:id/cancel', leaveController.cancelLeave);
