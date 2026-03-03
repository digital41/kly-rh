import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { AuthUser } from './auth.store';

const SESSION_KEY = 'kly-auth';

const mockUser: AuthUser = {
  name: 'Alice Dupont',
  initials: 'AD',
  role: 'manager',
  email: 'alice@example.com',
};

describe('useAuthStore', () => {
  // We keep a lazily-imported reference that is refreshed in beforeEach
  // so each test starts with a clean store and empty sessionStorage.
  let useAuthStore: typeof import('./auth.store')['useAuthStore'];

  beforeEach(async () => {
    sessionStorage.clear();
    vi.resetModules();
    const mod = await import('./auth.store');
    useAuthStore = mod.useAuthStore;
    // Reset state to the unauthenticated defaults
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
    });
  });

  // ------------------------------------------------------------------ 1
  it('has correct initial state when no session exists', () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
  });

  // ------------------------------------------------------------------ 2
  it('login() sets isAuthenticated and user, and persists to sessionStorage', () => {
    useAuthStore.getState().login(mockUser);

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user).toEqual(mockUser);

    // Verify sessionStorage was written
    const stored = sessionStorage.getItem(SESSION_KEY);
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!)).toEqual(mockUser);
  });

  // ------------------------------------------------------------------ 3
  it('logout() clears state and sessionStorage', () => {
    // Start logged-in
    useAuthStore.getState().login(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    useAuthStore.getState().logout();

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  // ------------------------------------------------------------------ 4
  it('switchRole() updates user.role and persists to sessionStorage', () => {
    useAuthStore.getState().login(mockUser);
    expect(useAuthStore.getState().user?.role).toBe('manager');

    useAuthStore.getState().switchRole('employee');

    const { user } = useAuthStore.getState();
    expect(user).not.toBeNull();
    expect(user!.role).toBe('employee');

    // All other fields remain unchanged
    expect(user!.name).toBe(mockUser.name);
    expect(user!.initials).toBe(mockUser.initials);
    expect(user!.email).toBe(mockUser.email);

    // sessionStorage reflects the updated role
    const stored = JSON.parse(sessionStorage.getItem(SESSION_KEY)!);
    expect(stored.role).toBe('employee');
  });

  // ------------------------------------------------------------------ 5
  it('switchRole() does nothing when user is null', () => {
    // Store starts with no user
    expect(useAuthStore.getState().user).toBeNull();

    useAuthStore.getState().switchRole('employee');

    const { isAuthenticated, user } = useAuthStore.getState();
    expect(isAuthenticated).toBe(false);
    expect(user).toBeNull();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();
  });

  // ------------------------------------------------------------------ 6
  it('loads user from sessionStorage on store creation', async () => {
    // Pre-seed sessionStorage BEFORE the module is imported
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(mockUser));

    // Force a fresh import so `loadSession()` runs with the seeded value
    vi.resetModules();
    const mod = await import('./auth.store');
    const freshStore = mod.useAuthStore;

    const { isAuthenticated, user } = freshStore.getState();
    expect(isAuthenticated).toBe(true);
    expect(user).toEqual(mockUser);
  });
});
