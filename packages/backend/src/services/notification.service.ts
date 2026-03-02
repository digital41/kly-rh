import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';

export async function getUserNotifications(userId: number) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function markAsRead(notificationId: number, userId: number) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new NotFoundError('Notification');
  }

  if (notification.userId !== userId) {
    throw new ForbiddenError('Vous ne pouvez modifier que vos propres notifications');
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllAsRead(userId: number) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
