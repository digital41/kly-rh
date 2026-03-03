import api from './client';
import type { UserRole } from '@kly-rh/shared';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    initials: string;
    email: string;
    role: UserRole;
  };
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
    sessionStorage.setItem('kly-access-token', data.accessToken);
    sessionStorage.setItem('kly-refresh-token', data.refreshToken);
    return data;
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = sessionStorage.getItem('kly-refresh-token');
      await api.post('/auth/logout', { refreshToken });
    } finally {
      sessionStorage.removeItem('kly-access-token');
      sessionStorage.removeItem('kly-refresh-token');
    }
  },
};
