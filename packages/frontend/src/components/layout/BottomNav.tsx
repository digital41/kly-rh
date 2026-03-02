import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores/ui.store';

interface BottomNavProps {
  profileBadge: number;
}

interface Tab {
  path: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function TeamIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function BalanceIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function ProfileIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const tabs: Tab[] = [
  {
    path: '/',
    label: 'Calendrier',
    icon: (active) => <CalendarIcon active={active} />,
  },
  {
    path: '/team',
    label: 'Équipe',
    icon: (active) => <TeamIcon active={active} />,
  },
  {
    path: '/balance',
    label: 'Solde',
    icon: (active) => <BalanceIcon active={active} />,
  },
  {
    path: '/profile',
    label: 'Profil',
    icon: (active) => <ProfileIcon active={active} />,
  },
];

export function BottomNav({ profileBadge }: BottomNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentRole = useUIStore((s) => s.currentRole);

  const visibleTabs = currentRole === 'manager'
    ? tabs
    : tabs.filter((t) => t.path !== '/team');

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex z-20" aria-label="Navigation principale">
      {visibleTabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        const isProfile = tab.path === '/profile';

        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
            className={`flex-1 h-16 flex flex-col items-center justify-center gap-0.5 transition-colors ${
              isActive ? 'text-primary' : 'text-text-tertiary'
            }`}
          >
            <div className="relative">
              {tab.icon(isActive)}
              {isProfile && profileBadge > 0 && (
                <span className="absolute -top-1 -right-1.5 min-w-[16px] h-4 bg-rejected text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                  {profileBadge}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
