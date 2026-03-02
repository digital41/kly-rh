import { create } from 'zustand';
import { EMPLOYEES, LEAVES } from '@/services/mock/mock-data';
import type { EmployeeListItem } from '@kly-rh/shared';

interface TeamState {
  searchQuery: string;
  activeDept: string;
  setSearch: (q: string) => void;
  setDept: (d: string) => void;
  getFilteredTeam: () => {
    out: EmployeeListItem[];
    remote: EmployeeListItem[];
    available: EmployeeListItem[];
  };
}

export const useTeamStore = create<TeamState>((set, get) => ({
  searchQuery: '',
  activeDept: 'Tous',

  setSearch: (q) => set({ searchQuery: q }),
  setDept: (d) => set({ activeDept: d }),

  getFilteredTeam: () => {
    const { searchQuery, activeDept } = get();
    const today = new Date().toISOString().split('T')[0];
    const q = searchQuery.toLowerCase();

    let filtered = EMPLOYEES;
    if (activeDept !== 'Tous') {
      filtered = filtered.filter((e) => e.department === activeDept);
    }
    if (q) {
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      );
    }

    const out: EmployeeListItem[] = [];
    const remote: EmployeeListItem[] = [];
    const available: EmployeeListItem[] = [];

    for (const emp of filtered) {
      const leave = LEAVES.find(
        (l) =>
          l.employeeId === emp.id &&
          l.status !== 'rejected' &&
          today >= l.start &&
          today <= l.end
      );

      if (leave) {
        if (leave.type === 'remote') {
          remote.push({ ...emp, status: 'remote', leaveType: leave.type });
        } else {
          out.push({ ...emp, status: 'out', leaveType: leave.type });
        }
      } else {
        available.push({ ...emp, status: 'available' });
      }
    }

    return { out, remote, available };
  },
}));
