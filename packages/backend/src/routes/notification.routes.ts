import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import * as notificationController from '../controllers/notification.controller.js';

export const notificationRoutes = Router();

notificationRoutes.use(authMiddleware);

notificationRoutes.get('/', notificationController.getNotifications);
notificationRoutes.put('/read-all', notificationController.markAllAsRead);
notificationRoutes.put('/:id/read', notificationController.markAsRead);
