import type { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notification.service.js';
import { BadRequestError } from '../utils/errors.js';

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const notifications = await notificationService.getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    next(error);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const notificationId = parseInt(req.params.id as string, 10);
    const userId = req.user!.userId;

    if (isNaN(notificationId)) {
      throw new BadRequestError('Identifiant de notification invalide');
    }

    const notification = await notificationService.markAsRead(notificationId, userId);
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await notificationService.markAllAsRead(userId);
    res.json({ updated: result.count });
  } catch (error) {
    next(error);
  }
}
