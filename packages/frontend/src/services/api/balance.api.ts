import api from './client';
import type { LeaveType } from '@kly-rh/shared';

interface BalanceResponse {
  type: LeaveType;
  label: string;
  color: string;
  total: number;
  used: number;
  acquired: number;
  annualMax: number;
}

export const balanceApi = {
  getMy: async (): Promise<BalanceResponse[]> => {
    const { data } = await api.get<BalanceResponse[]>('/balances/my');
    return data;
  },

  getByEmployee: async (employeeId: number): Promise<BalanceResponse[]> => {
    const { data } = await api.get<BalanceResponse[]>(`/balances/${employeeId}`);
    return data;
  },

  update: async (employeeId: number, type: LeaveType, updates: { used?: number; annualMax?: number }): Promise<void> => {
    await api.patch(`/balances/${employeeId}/${type}`, updates);
  },
};
