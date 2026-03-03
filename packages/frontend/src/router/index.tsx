import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/router/ProtectedRoute';
import { LoginScreen } from '@/screens/LoginScreen';

/* ─── Lazy-loaded screens (Phase E: code splitting) ─── */
const CalendarScreen = lazy(() => import('@/screens/CalendarScreen').then((m) => ({ default: m.CalendarScreen })));
const TeamScreen = lazy(() => import('@/screens/TeamScreen').then((m) => ({ default: m.TeamScreen })));
const BalanceScreen = lazy(() => import('@/screens/BalanceScreen').then((m) => ({ default: m.BalanceScreen })));
const ProfileScreen = lazy(() => import('@/screens/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const ApprovalsScreen = lazy(() => import('@/screens/ApprovalsScreen').then((m) => ({ default: m.ApprovalsScreen })));
const MyRequestsScreen = lazy(() => import('@/screens/MyRequestsScreen').then((m) => ({ default: m.MyRequestsScreen })));
const NotificationsScreen = lazy(() => import('@/screens/NotificationsScreen').then((m) => ({ default: m.NotificationsScreen })));
const SettingsScreen = lazy(() => import('@/screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })));
const ManageBalancesScreen = lazy(() => import('@/screens/ManageBalancesScreen').then((m) => ({ default: m.ManageBalancesScreen })));
const ManageEmployeesScreen = lazy(() => import('@/screens/ManageEmployeesScreen').then((m) => ({ default: m.ManageEmployeesScreen })));

function ScreenFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<ScreenFallback />}>
        <Routes>
          {/* Login - no shell, no auth required */}
          <Route path="/login" element={<LoginScreen />} />

          {/* Protected app routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<CalendarScreen />} />
            <Route path="/team" element={<TeamScreen />} />
            <Route path="/balance" element={<BalanceScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />

            {/* Sub-screens */}
            <Route path="/my-requests" element={<MyRequestsScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />

            {/* Manager-only routes */}
            <Route
              path="/approvals"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ApprovalsScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-balances"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManageBalancesScreen />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manage-employees"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <ManageEmployeesScreen />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
