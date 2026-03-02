import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LoginScreen } from '@/screens/LoginScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { TeamScreen } from '@/screens/TeamScreen';
import { BalanceScreen } from '@/screens/BalanceScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { ApprovalsScreen } from '@/screens/ApprovalsScreen';
import { MyRequestsScreen } from '@/screens/MyRequestsScreen';
import { NotificationsScreen } from '@/screens/NotificationsScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { ManageBalancesScreen } from '@/screens/ManageBalancesScreen';
import { ManageEmployeesScreen } from '@/screens/ManageEmployeesScreen';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login - no shell */}
        <Route path="/login" element={<LoginScreen />} />

        {/* Main screens inside AppShell */}
        <Route element={<AppShell />}>
          <Route path="/" element={<CalendarScreen />} />
          <Route path="/team" element={<TeamScreen />} />
          <Route path="/balance" element={<BalanceScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />

          {/* Sub-screens (AppShell handles back button via route config) */}
          <Route path="/approvals" element={<ApprovalsScreen />} />
          <Route path="/my-requests" element={<MyRequestsScreen />} />
          <Route path="/notifications" element={<NotificationsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/manage-balances" element={<ManageBalancesScreen />} />
          <Route path="/manage-employees" element={<ManageEmployeesScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
