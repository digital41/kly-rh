import api from './client';
import type { Notification } from '@kly-rh/shared';

export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  },

  markRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
