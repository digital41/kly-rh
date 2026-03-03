import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Fab } from '@/components/layout/Fab';
import { LeaveRequestSheet } from '@/components/leave-form/LeaveRequestSheet';
import { Toast } from '@/components/ui/Toast';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { useNotificationStore } from '@/stores/notification.store';

interface RouteConfig {
  title: string;
  showBack: boolean;
  showAvatar: boolean;
}

const ROUTE_CONFIG: Record<string, RouteConfig> = {
  '/': { title: 'KLY Conges', showBack: false, showAvatar: true },
  '/team': { title: 'Equipe', showBack: false, showAvatar: true },
  '/balance': { title: 'Solde', showBack: false, showAvatar: true },
  '/profile': { title: 'Profil', showBack: false, showAvatar: true },
  '/approvals': { title: 'Approbations', showBack: true, showAvatar: false },
  '/my-requests': { title: 'Mes demandes', showBack: true, showAvatar: false },
  '/notifications': { title: 'Notifications', showBack: true, showAvatar: false },
  '/settings': { title: 'Parametres', showBack: true, showAvatar: false },
  '/manage-balances': { title: 'Gestion des soldes', showBack: true, showAvatar: false },
  '/manage-employees': { title: 'Gestion des employes', showBack: true, showAvatar: false },
};

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const openSheet = useUIStore((s) => s.openSheet);
  const user = useAuthStore((s) => s.user);
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const config = ROUTE_CONFIG[location.pathname] ?? {
    title: '',
    showBack: true,
    showAvatar: false,
  };

  const isCalendar = location.pathname === '/';

  return (
    <div className="app-container">
      <Header
        title={config.title}
        showBack={config.showBack}
        onBack={() => navigate(-1)}
        showAvatar={config.showAvatar}
        initials={user?.initials ?? '??'}
        onAvatarClick={() => navigate('/profile')}
      />

      <main className="absolute top-[56px] bottom-[64px] left-0 right-0 overflow-y-auto overflow-x-clip">
        <Outlet />
      </main>

      <BottomNav profileBadge={unreadCount} />
      <Fab onClick={openSheet} visible={isCalendar} />
      <LeaveRequestSheet />
      <Toast />
    </div>
  );
}
