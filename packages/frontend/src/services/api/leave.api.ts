import api from './client';
import type { LeaveType, LeaveStatus } from '@kly-rh/shared';

interface LeaveRequest {
  type: LeaveType;
  start: string;
  end: string;
  days: number;
  note?: string;
}

interface LeaveResponse {
  id: number;
  type: LeaveType;
  start: string;
  end: string;
  days: number;
  status: LeaveStatus;
  note: string;
  employeeId: number;
  employeeName: string;
  createdAt: string;
}

export const leaveApi = {
  getMyRequests: async (): Promise<LeaveResponse[]> => {
    const { data } = await api.get<LeaveResponse[]>('/leaves/my');
    return data;
  },

  getPending: async (): Promise<LeaveResponse[]> => {
    const { data } = await api.get<LeaveResponse[]>('/leaves/pending');
    return data;
  },

  create: async (request: LeaveRequest): Promise<LeaveResponse> => {
    const { data } = await api.post<LeaveResponse>('/leaves', request);
    return data;
  },

  approve: async (id: number): Promise<void> => {
    await api.patch(`/leaves/${id}/approve`);
  },

  reject: async (id: number, reason?: string): Promise<void> => {
    await api.patch(`/leaves/${id}/reject`, { reason });
  },

  cancel: async (id: number): Promise<void> => {
    await api.patch(`/leaves/${id}/cancel`);
  },
};
