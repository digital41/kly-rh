import { create } from 'zustand';
import { NOTIFICATIONS } from '@/services/mock/mock-data';
import type { Notification } from '@kly-rh/shared';

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markRead: (id: number) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [...NOTIFICATIONS],

  unreadCount: () => get().notifications.filter((n) => n.unread).length,

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, unread: false } : n
      ),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, unread: false })),
    })),
}));
