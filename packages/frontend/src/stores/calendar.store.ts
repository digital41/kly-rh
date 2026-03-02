import { create } from 'zustand';
import { LEAVES, EMPLOYEES } from '@/services/mock/mock-data';
import type { LeaveRecord } from '@/services/mock/mock-data';
import type { LeaveType, LeaveStatus } from '@kly-rh/shared';

export interface LeaveWithEmployee {
  employeeId: number;
  employeeName: string;
  employeeInitials: string;
  employeeColor: string;
  type: LeaveType;
  start: string;
  end: string;
  status: LeaveStatus;
  note?: string;
}

interface CalendarState {
  currentMonth: number;
  currentYear: number;
  selectedDay: number | null;
  rangeStart: number | null;
  rangeEnd: number | null;
  leaves: LeaveRecord[];
  changeMonth: (dir: -1 | 1) => void;
  selectDay: (day: number | null) => void;
  selectRange: (day: number) => void;
  clearRange: () => void;
  getLeavesForDate: (dateStr: string) => LeaveWithEmployee[];
  getTodayLeaves: () => LeaveWithEmployee[];
}

function enrichLeave(l: LeaveRecord): LeaveWithEmployee | null {
  const emp = EMPLOYEES.find(e => e.id === l.employeeId);
  if (!emp) return null;
  return {
    employeeId: l.employeeId,
    employeeName: emp.name,
    employeeInitials: emp.initials,
    employeeColor: emp.color,
    type: l.type,
    start: l.start,
    end: l.end,
    status: l.status,
    note: l.note,
  };
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
  currentMonth: 2,
  currentYear: 2026,
  selectedDay: null,
  rangeStart: null,
  rangeEnd: null,
  leaves: LEAVES,

  changeMonth: (dir) =>
    set((s) => {
      let m = s.currentMonth + dir;
      let y = s.currentYear;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { currentMonth: m, currentYear: y, selectedDay: null, rangeStart: null, rangeEnd: null };
    }),

  selectDay: (day) =>
    set((s) => ({
      selectedDay: s.selectedDay === day ? null : day,
    })),

  selectRange: (day) =>
    set((s) => {
      if (s.rangeStart === null || s.rangeEnd !== null) {
        // First click or reset: set start
        return { rangeStart: day, rangeEnd: null, selectedDay: day };
      }
      // Second click: set end (ensure start <= end)
      if (day < s.rangeStart) {
        return { rangeStart: day, rangeEnd: s.rangeStart, selectedDay: null };
      }
      return { rangeEnd: day, selectedDay: null };
    }),

  clearRange: () => set({ rangeStart: null, rangeEnd: null }),

  getLeavesForDate: (dateStr) => {
    return get()
      .leaves.filter((l) => l.status !== 'rejected' && dateStr >= l.start && dateStr <= l.end)
      .map(enrichLeave)
      .filter((l): l is LeaveWithEmployee => l !== null);
  },

  getTodayLeaves: () => {
    const today = new Date().toISOString().split('T')[0];
    return get().getLeavesForDate(today);
  },
}));
