import { useNotificationStore } from '@/stores/notification.store';
import { EmptyState } from '@/components/ui/EmptyState';

export function NotificationsScreen() {
  const { notifications, markRead, markAllRead } = useNotificationStore();
  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-3">
        {/* Mark all read button */}
        {hasUnread && (
          <div className="flex justify-end">
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-primary"
            >
              Tout marquer comme lu
            </button>
          </div>
        )}

        {/* Empty state */}
        {notifications.length === 0 && (
          <EmptyState
            icon="🔔"
            title="Aucune notification"
            subtitle="Vous n'avez pas encore de notifications"
          />
        )}

        {/* Notification items */}
        {notifications.map((notif) => (
          <button
            key={notif.id}
            onClick={() => markRead(notif.id)}
            className={`w-full text-left rounded-[12px] shadow-sm p-4 flex gap-3 transition-all duration-200 ${
              notif.unread
                ? 'bg-primary-lighter shadow-md border-l-4 border-primary'
                : 'bg-surface'
            }`}
          >
            {/* Icon circle */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: notif.bgColor }}
            >
              <span className="text-base">{notif.icon}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p
                className="text-[13px] text-text leading-relaxed"
                dangerouslySetInnerHTML={{ __html: notif.text }}
              />
              <p className="text-[11px] text-text-tertiary mt-1">{notif.time}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
