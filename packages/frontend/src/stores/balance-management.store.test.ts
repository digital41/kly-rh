import { describe, it, expect, beforeEach } from 'vitest';
import { useBalanceManagementStore, ACCRUAL_RULES } from './balance-management.store';

/** Reset the store to its initial state before each test */
function resetStore() {
  useBalanceManagementStore.setState(useBalanceManagementStore.getInitialState());
}

describe('ACCRUAL_RULES', () => {
  it('has exactly 4 leave types', () => {
    expect(ACCRUAL_RULES).toHaveLength(4);
  });

  it('vacation: annualMax=25, monthlyRate=2.08', () => {
    const rule = ACCRUAL_RULES.find((r) => r.type === 'vacation');
    expect(rule).toBeDefined();
    expect(rule!.annualMax).toBe(25);
    expect(rule!.monthlyRate).toBe(2.08);
  });

  it('sick: annualMax=10, monthlyRate=0', () => {
    const rule = ACCRUAL_RULES.find((r) => r.type === 'sick');
    expect(rule).toBeDefined();
    expect(rule!.annualMax).toBe(10);
    expect(rule!.monthlyRate).toBe(0);
  });

  it('personal: annualMax=5, monthlyRate=0', () => {
    const rule = ACCRUAL_RULES.find((r) => r.type === 'personal');
    expect(rule).toBeDefined();
    expect(rule!.annualMax).toBe(5);
    expect(rule!.monthlyRate).toBe(0);
  });

  it('remote: annualMax=48, monthlyRate=4', () => {
    const rule = ACCRUAL_RULES.find((r) => r.type === 'remote');
    expect(rule).toBeDefined();
    expect(rule!.annualMax).toBe(48);
    expect(rule!.monthlyRate).toBe(4);
  });
});

describe('useBalanceManagementStore – initialization', () => {
  beforeEach(() => {
    resetStore();
  });

  it('initializes currentMonth to the real current month', () => {
    const { currentMonth } = useBalanceManagementStore.getState();
    expect(currentMonth).toBe(new Date().getMonth());
  });

  it('initializes currentYear to the real current year', () => {
    const { currentYear } = useBalanceManagementStore.getState();
    expect(currentYear).toBe(new Date().getFullYear());
  });
});

describe('useBalanceManagementStore – nextMonth / prevMonth', () => {
  beforeEach(() => {
    resetStore();
  });

  it('nextMonth() increments the month by 1', () => {
    const store = useBalanceManagementStore.getState();
    const initialMonth = store.currentMonth;
    const initialYear = store.currentYear;

    store.nextMonth();

    const { currentMonth, currentYear } = useBalanceManagementStore.getState();
    if (initialMonth === 11) {
      expect(currentMonth).toBe(0);
      expect(currentYear).toBe(initialYear + 1);
    } else {
      expect(currentMonth).toBe(initialMonth + 1);
      expect(currentYear).toBe(initialYear);
    }
  });

  it('nextMonth() wraps from December to January and increments year', () => {
    // Force the store to December
    useBalanceManagementStore.setState({ currentMonth: 11, currentYear: 2025 });

    useBalanceManagementStore.getState().nextMonth();

    const { currentMonth, currentYear } = useBalanceManagementStore.getState();
    expect(currentMonth).toBe(0);
    expect(currentYear).toBe(2026);
  });

  it('prevMonth() decrements the month by 1', () => {
    // Start from March so we can decrement without wrapping
    useBalanceManagementStore.setState({ currentMonth: 2, currentYear: 2026 });

    useBalanceManagementStore.getState().prevMonth();

    const { currentMonth, currentYear } = useBalanceManagementStore.getState();
    expect(currentMonth).toBe(1);
    expect(currentYear).toBe(2026);
  });

  it('prevMonth() wraps from January to December and decrements year', () => {
    useBalanceManagementStore.setState({ currentMonth: 0, currentYear: 2026 });

    useBalanceManagementStore.getState().prevMonth();

    const { currentMonth, currentYear } = useBalanceManagementStore.getState();
    expect(currentMonth).toBe(11);
    expect(currentYear).toBe(2025);
  });
});

describe('useBalanceManagementStore – setUsed', () => {
  beforeEach(() => {
    resetStore();
  });

  it('updates the used value for a specific employee and leave type', () => {
    const store = useBalanceManagementStore.getState();
    const employeeId = 1;

    // First verify the employee exists in balances
    const balancesBefore = store.employeeBalances[employeeId];
    expect(balancesBefore).toBeDefined();
    expect(balancesBefore.length).toBeGreaterThan(0);

    // Set vacation used to 5
    store.setUsed(employeeId, 'vacation', 5);

    const balancesAfter = useBalanceManagementStore.getState().employeeBalances[employeeId];
    const vacationBalance = balancesAfter.find((b) => b.type === 'vacation');
    expect(vacationBalance).toBeDefined();
    expect(vacationBalance!.used).toBe(5);
  });

  it('clamps negative used values to 0', () => {
    const store = useBalanceManagementStore.getState();
    store.setUsed(1, 'vacation', -3);

    const balances = useBalanceManagementStore.getState().employeeBalances[1];
    const vacationBalance = balances.find((b) => b.type === 'vacation');
    expect(vacationBalance!.used).toBe(0);
  });

  it('does not modify other leave types when setting used', () => {
    const store = useBalanceManagementStore.getState();
    const employeeId = 1;

    const sickBefore = store.employeeBalances[employeeId].find((b) => b.type === 'sick')!.used;

    store.setUsed(employeeId, 'vacation', 10);

    const sickAfter = useBalanceManagementStore.getState().employeeBalances[employeeId].find(
      (b) => b.type === 'sick',
    )!.used;
    expect(sickAfter).toBe(sickBefore);
  });
});

describe('useBalanceManagementStore – setAnnualMax', () => {
  beforeEach(() => {
    resetStore();
  });

  it('updates the annualMax for a specific employee and leave type', () => {
    const store = useBalanceManagementStore.getState();
    store.setAnnualMax(1, 'vacation', 30);

    const balances = useBalanceManagementStore.getState().employeeBalances[1];
    const vacationBalance = balances.find((b) => b.type === 'vacation');
    expect(vacationBalance).toBeDefined();
    expect(vacationBalance!.annualMax).toBe(30);
  });

  it('recomputes acquired after changing annualMax', () => {
    // Set to month index 5 (June) so monthsElapsed = 6
    useBalanceManagementStore.setState({ currentMonth: 5, currentYear: 2026 });
    const store = useBalanceManagementStore.getState();

    // Set a low annualMax for vacation that will cap the acquired
    // monthlyRate=2.08, monthsElapsed=6 => 2.08*6=12.48
    // If annualMax=8, acquired should be capped at 8
    store.setAnnualMax(1, 'vacation', 8);

    const balances = useBalanceManagementStore.getState().employeeBalances[1];
    const vacationBalance = balances.find((b) => b.type === 'vacation');
    expect(vacationBalance!.annualMax).toBe(8);
    expect(vacationBalance!.acquired).toBe(8);
  });

  it('clamps negative annualMax to 0', () => {
    const store = useBalanceManagementStore.getState();
    store.setAnnualMax(1, 'sick', -5);

    const balances = useBalanceManagementStore.getState().employeeBalances[1];
    const sickBalance = balances.find((b) => b.type === 'sick');
    expect(sickBalance!.annualMax).toBe(0);
  });
});
