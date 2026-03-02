import { create } from 'zustand';
import { MY_REQUESTS, LEAVES } from '@/services/mock/mock-data';
import type { MyRequest, LeaveStatus } from '@kly-rh/shared';
import type { LeaveRecord } from '@/services/mock/mock-data';

interface LeaveState {
  myRequests: MyRequest[];
  leaves: LeaveRecord[];
  activeFilter: 'all' | LeaveStatus;
  setFilter: (f: 'all' | LeaveStatus) => void;
  cancelRequest: (index: number) => void;
  approveLeave: (index: number) => void;
  rejectLeave: (index: number) => void;
  submitRequest: (req: Omit<MyRequest, 'status'>) => void;
  getFilteredRequests: () => MyRequest[];
  getPendingApprovals: () => LeaveRecord[];
}

export const useLeaveStore = create<LeaveState>((set, get) => ({
  myRequests: [...MY_REQUESTS],
  leaves: [...LEAVES],
  activeFilter: 'all',

  setFilter: (f) => set({ activeFilter: f }),

  cancelRequest: (index) =>
    set((s) => {
      const updated = [...s.myRequests];
      updated[index] = { ...updated[index], status: 'cancelled' };
      return { myRequests: updated };
    }),

  approveLeave: (index) =>
    set((s) => {
      const pending = s.leaves.filter((l) => l.status === 'pending');
      const leave = pending[index];
      if (!leave) return s;
      return {
        leaves: s.leaves.map((l) =>
          l === leave ? { ...l, status: 'approved' as const } : l
        ),
      };
    }),

  rejectLeave: (index) =>
    set((s) => {
      const pending = s.leaves.filter((l) => l.status === 'pending');
      const leave = pending[index];
      if (!leave) return s;
      return {
        leaves: s.leaves.map((l) =>
          l === leave ? { ...l, status: 'rejected' as const } : l
        ),
      };
    }),

  submitRequest: (req) =>
    set((s) => ({
      myRequests: [{ ...req, status: 'pending' }, ...s.myRequests],
    })),

  getFilteredRequests: () => {
    const { myRequests, activeFilter } = get();
    if (activeFilter === 'all') return myRequests;
    return myRequests.filter((r) => r.status === activeFilter);
  },

  getPendingApprovals: () => {
    return get().leaves.filter((l) => l.status === 'pending');
  },
}));
