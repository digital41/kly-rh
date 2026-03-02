import { Router } from 'express';
import { authRoutes } from './auth.routes.js';
import { leaveRoutes } from './leave.routes.js';
import { calendarRoutes } from './calendar.routes.js';
import { balanceRoutes } from './balance.routes.js';
import { teamRoutes } from './team.routes.js';
import { profileRoutes } from './profile.routes.js';
import { notificationRoutes } from './notification.routes.js';

export const routes = Router();
routes.use('/auth', authRoutes);
routes.use('/leaves', leaveRoutes);
routes.use('/calendar', calendarRoutes);
routes.use('/balances', balanceRoutes);
routes.use('/team', teamRoutes);
routes.use('/profile', profileRoutes);
routes.use('/notifications', notificationRoutes);
