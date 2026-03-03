import { create } from 'zustand';
import type { UserRole } from '@kly-rh/shared';

export interface AuthUser {
  name: string;
  initials: string;
  role: UserRole;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const SESSION_KEY = 'kly-auth';

function loadSession(): { isAuthenticated: boolean; user: AuthUser | null } {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) {
      const user = JSON.parse(raw) as AuthUser;
      return { isAuthenticated: true, user };
    }
  } catch {
    // ignore corrupt session
  }
  return { isAuthenticated: false, user: null };
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...loadSession(),

  login: (user) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    set({ isAuthenticated: true, user });
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false, user: null });
  },

  switchRole: (role) => {
    const user = get().user;
    if (!user) return;
    const updated = { ...user, role };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    set({ user: updated });
  },
}));
