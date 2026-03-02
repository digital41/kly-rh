import { create } from 'zustand';
import type { LeaveType } from '@kly-rh/shared';
import { TYPE_LABELS, TYPE_COLORS } from '@kly-rh/shared';
import { EMPLOYEES } from '@/services/mock/mock-data';

/* ─── Accrual configuration ─── */

export interface AccrualRule {
  type: LeaveType;
  label: string;
  color: string;
  annualMax: number;
  /** Days acquired per month worked. 0 = full allocation on Jan 1st */
  monthlyRate: number;
}

export const ACCRUAL_RULES: AccrualRule[] = [
  { type: 'vacation',  label: TYPE_LABELS.vacation,  color: TYPE_COLORS.vacation,  annualMax: 25, monthlyRate: 2.08 },
  { type: 'sick',      label: TYPE_LABELS.sick,      color: TYPE_COLORS.sick,      annualMax: 10, monthlyRate: 0 },
  { type: 'personal',  label: TYPE_LABELS.personal,  color: TYPE_COLORS.personal,  annualMax: 5,  monthlyRate: 0 },
  { type: 'remote',    label: TYPE_LABELS.remote,    color: TYPE_COLORS.remote,    annualMax: 48, monthlyRate: 4 },
];

/* ─── Employee balance model ─── */

export interface EmployeeLeaveBalance {
  type: LeaveType;
  label: string;
  color: string;
  annualMax: number;
  monthlyRate: number;
  acquired: number;   // Days accrued so far this year
  used: number;        // Days taken
}

const MONTHS_FR = [
  'Janvier', 'Fevrier', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Aout', 'Septembre', 'Octobre', 'Novembre', 'Decembre',
];

/** Compute acquired days for a given month count */
function computeAcquired(rule: AccrualRule, monthsElapsed: number): number {
  if (rule.monthlyRate === 0) return rule.annualMax;
  return Math.min(
    Math.round(rule.monthlyRate * monthsElapsed * 100) / 100,
    rule.annualMax,
  );
}

function generateEmployeeBalances(monthsElapsed: number): Record<number, EmployeeLeaveBalance[]> {
  const map: Record<number, EmployeeLeaveBalance[]> = {};
  for (const emp of EMPLOYEES) {
    map[emp.id] = ACCRUAL_RULES.map((rule) => ({
      type: rule.type,
      label: rule.label,
      color: rule.color,
      annualMax: rule.annualMax,
      monthlyRate: rule.monthlyRate,
      acquired: computeAcquired(rule, monthsElapsed),
      used: Math.floor(Math.random() * Math.min(computeAcquired(rule, monthsElapsed), 8)),
    }));
  }
  return map;
}

/* ─── Store ─── */

interface BalanceManagementState {
  /** Current simulated month (0-11) */
  currentMonth: number;
  /** Current simulated year */
  currentYear: number;

  /** Per-employee balances indexed by employee ID */
  employeeBalances: Record<number, EmployeeLeaveBalance[]>;

  /** Navigate to next month — recomputes acquired for all employees */
  nextMonth: () => void;
  /** Navigate to previous month */
  prevMonth: () => void;

  /** Get formatted month label */
  getMonthLabel: () => string;

  /** Update the "used" value for a specific employee + leave type */
  setUsed: (employeeId: number, type: LeaveType, used: number) => void;

  /** Update the annual max for a specific employee + leave type */
  setAnnualMax: (employeeId: number, type: LeaveType, annualMax: number) => void;

  /** Get balances for a specific employee */
  getBalances: (employeeId: number) => EmployeeLeaveBalance[];
}

const NOW = new Date();
const INITIAL_MONTH = NOW.getMonth();
const INITIAL_YEAR = NOW.getFullYear();

export const useBalanceManagementStore = create<BalanceManagementState>((set, get) => ({
  currentMonth: INITIAL_MONTH,
  currentYear: INITIAL_YEAR,
  employeeBalances: generateEmployeeBalances(INITIAL_MONTH + 1),

  nextMonth: () =>
    set((s) => {
      let newMonth = s.currentMonth + 1;
      let newYear = s.currentYear;
      if (newMonth > 11) {
        newMonth = 0;
        newYear++;
      }
      const monthsElapsed = newMonth + 1;

      // Recompute acquired for all employees, keep their used values
      const updated: Record<number, EmployeeLeaveBalance[]> = {};
      for (const [idStr, balances] of Object.entries(s.employeeBalances)) {
        updated[Number(idStr)] = balances.map((b) => {
          const rule = ACCRUAL_RULES.find((r) => r.type === b.type);
          const newAcquired = rule
            ? computeAcquired({ ...rule, annualMax: b.annualMax }, monthsElapsed)
            : b.acquired;
          return { ...b, acquired: newAcquired };
        });
      }

      return { currentMonth: newMonth, currentYear: newYear, employeeBalances: updated };
    }),

  prevMonth: () =>
    set((s) => {
      let newMonth = s.currentMonth - 1;
      let newYear = s.currentYear;
      if (newMonth < 0) {
        newMonth = 11;
        newYear--;
      }
      const monthsElapsed = newMonth + 1;

      const updated: Record<number, EmployeeLeaveBalance[]> = {};
      for (const [idStr, balances] of Object.entries(s.employeeBalances)) {
        updated[Number(idStr)] = balances.map((b) => {
          const rule = ACCRUAL_RULES.find((r) => r.type === b.type);
          const newAcquired = rule
            ? computeAcquired({ ...rule, annualMax: b.annualMax }, monthsElapsed)
            : b.acquired;
          return { ...b, acquired: newAcquired };
        });
      }

      return { currentMonth: newMonth, currentYear: newYear, employeeBalances: updated };
    }),

  getMonthLabel: () => {
    const { currentMonth, currentYear } = get();
    return `${MONTHS_FR[currentMonth]} ${currentYear}`;
  },

  setUsed: (employeeId, type, used) =>
    set((s) => {
      const balances = s.employeeBalances[employeeId];
      if (!balances) return s;
      return {
        employeeBalances: {
          ...s.employeeBalances,
          [employeeId]: balances.map((b) =>
            b.type === type ? { ...b, used: Math.max(0, used) } : b,
          ),
        },
      };
    }),

  setAnnualMax: (employeeId, type, annualMax) =>
    set((s) => {
      const balances = s.employeeBalances[employeeId];
      if (!balances) return s;
      const monthsElapsed = s.currentMonth + 1;
      return {
        employeeBalances: {
          ...s.employeeBalances,
          [employeeId]: balances.map((b) => {
            if (b.type !== type) return b;
            const newMax = Math.max(0, annualMax);
            const rule = ACCRUAL_RULES.find((r) => r.type === b.type);
            const newAcquired = rule
              ? computeAcquired({ ...rule, annualMax: newMax }, monthsElapsed)
              : newMax;
            return { ...b, annualMax: newMax, acquired: newAcquired };
          }),
        },
      };
    }),

  getBalances: (employeeId) => {
    return get().employeeBalances[employeeId] ?? [];
  },
}));
