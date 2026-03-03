import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { useLeaveStore } from '@/stores/leave.store';
import { useNotificationStore } from '@/stores/notification.store';
import { Avatar } from '@/components/ui/Avatar';
import { Toggle } from '@/components/ui/Toggle';
import { PROFILES, BALANCES, EMPLOYEES } from '@/services/mock/mock-data';

export function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const leaves = useLeaveStore((s) => s.leaves);
  const pendingApprovals = useMemo(() => leaves.filter((l) => l.status === 'pending'), [leaves]);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);
  const [timeTrackingEnabled, setTimeTrackingEnabled] = useState(false);

  const currentRole = user?.role ?? 'employee';
  const profile = user
    ? { name: user.name, initials: user.initials, role: PROFILES[currentRole as keyof typeof PROFILES]?.role ?? '' }
    : PROFILES.employee;
  const isManager = currentRole === 'manager';

  // Calculate remaining non-remote days
  const remainingDays = BALANCES
    .filter((b) => b.type !== 'remote')
    .reduce((sum, b) => sum + (b.total - b.used), 0);

  // Pending requests count
  const pendingCount = pendingApprovals.length;

  // Avatar color based on role
  const avatarColor = currentRole === 'manager' ? '#3B82F6' : '#8B5CF6';

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="flex flex-col items-center py-4">
          <Avatar initials={profile.initials} color={avatarColor} size="lg" />
          <p className="text-lg font-bold text-text mt-3">{profile.name}</p>
          <p className="text-sm text-text-secondary mt-0.5">{profile.role}</p>
          <span
            className="mt-2 text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{
              backgroundColor: isManager ? '#DBEAFE' : '#EDE9FE',
              color: isManager ? '#1D4ED8' : '#8B5CF6',
            }}
          >
            {isManager ? 'Manager' : 'Collaborateur'}
          </span>
        </div>

        {/* Quick Stats */}
        <div className={`grid ${isManager ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
          <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-primary">{remainingDays}</p>
            <p className="text-[11px] text-text-secondary">Jours restants</p>
          </div>
          <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
            <p className="text-xl font-bold text-pending">{pendingCount}</p>
            <p className="text-[11px] text-text-secondary">En attente</p>
          </div>
          {isManager && (
            <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
              <p className="text-xl font-bold text-text">{EMPLOYEES.length}</p>
              <p className="text-[11px] text-text-secondary">Equipe</p>
            </div>
          )}
        </div>

        {/* Menu List */}
        <div className="bg-surface rounded-[16px] shadow-sm divide-y divide-border">
          {isManager && (
            <button
              onClick={() => navigate('/approvals')}
              className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
            >
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                  <path d="M9 14l2 2 4-4" />
                </svg>
                <span className="text-sm font-medium text-text">Approbations</span>
              </div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <span className="min-w-[20px] h-5 bg-rejected text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5">
                    {pendingCount}
                  </span>
                )}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          )}

          {isManager && (
            <button
              onClick={() => navigate('/manage-balances')}
              className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
            >
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" />
                  <path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
                <span className="text-sm font-medium text-text">Gestion des soldes</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          {isManager && (
            <button
              onClick={() => navigate('/manage-employees')}
              className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
            >
              <div className="flex items-center gap-3">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
                <span className="text-sm font-medium text-text">Gestion des employes</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}

          <button
            onClick={() => navigate('/my-requests')}
            className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
          >
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              <span className="text-sm font-medium text-text">Mes demandes</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
          >
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="text-sm font-medium text-text">Notifications</span>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="min-w-[20px] h-5 bg-rejected text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5">
                  {unreadCount}
                </span>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="flex items-center justify-between px-4 min-h-[56px] w-full text-left"
          >
            <div className="flex items-center gap-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text-secondary"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <span className="text-sm font-medium text-text">Parametres</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Optional Modules (Manager only) */}
        {isManager && (
          <div className="bg-surface rounded-[16px] shadow-sm p-4">
            <p className="text-[12px] font-semibold text-text-secondary tracking-wider uppercase mb-3">
              MODULES OPTIONNELS
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text">Suivi du temps</span>
              <Toggle on={timeTrackingEnabled} onChange={setTimeTrackingEnabled} />
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full py-4 bg-rejected-bg text-rejected rounded-[12px] text-[15px] font-semibold transition-all active:bg-[#FEE2E2]"
        >
          Deconnexion
        </button>
      </div>
    </div>
  );
}
