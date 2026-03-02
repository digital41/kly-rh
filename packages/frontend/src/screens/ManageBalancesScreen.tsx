import { useState, useMemo, useCallback } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { SearchBar } from '@/components/ui/SearchBar';
import { FilterChip } from '@/components/ui/FilterChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { useBalanceManagementStore } from '@/stores/balance-management.store';
import type { EmployeeLeaveBalance } from '@/stores/balance-management.store';
import { useUIStore } from '@/stores/ui.store';
import { EMPLOYEES } from '@/services/mock/mock-data';
import { DEPARTMENTS } from '@kly-rh/shared';
import type { LeaveType } from '@kly-rh/shared';

/* ─── Progress Bar ─── */

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="h-1.5 bg-border rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

/* ─── Month Navigator ─── */

function MonthNavigator() {
  const currentMonth = useBalanceManagementStore((s) => s.currentMonth);
  const currentYear = useBalanceManagementStore((s) => s.currentYear);
  const monthLabel = useBalanceManagementStore((s) => s.getMonthLabel());
  const nextMonth = useBalanceManagementStore((s) => s.nextMonth);
  const prevMonth = useBalanceManagementStore((s) => s.prevMonth);

  const now = new Date();
  const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();

  return (
    <div className="bg-surface rounded-[16px] shadow-sm p-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border active:bg-border transition-colors"
          aria-label="Mois precedent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="text-center">
          <p className="text-[15px] font-bold text-text">{monthLabel}</p>
          {isCurrentMonth && (
            <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Mois actuel</span>
          )}
        </div>

        <button
          type="button"
          onClick={nextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border active:bg-border transition-colors"
          aria-label="Mois suivant"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── Accrual Info Card ─── */

function AccrualInfoCard() {
  const currentMonth = useBalanceManagementStore((s) => s.currentMonth);
  const monthsElapsed = currentMonth + 1;

  return (
    <div className="bg-primary-lighter rounded-[12px] px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span className="text-[12px] font-semibold text-primary">Acquisition en cours</span>
      </div>
      <p className="text-[11px] text-primary/80">
        {monthsElapsed} mois ecoule{monthsElapsed > 1 ? 's' : ''} — Les conges payes s'acquierent a 2.08j/mois, le teletravail a 4j/mois
      </p>
    </div>
  );
}

/* ─── Balance Editor ─── */

interface BalanceEditorProps {
  balance: EmployeeLeaveBalance;
  employeeId: number;
  onClose: () => void;
}

function BalanceEditor({ balance, employeeId, onClose }: BalanceEditorProps) {
  const setUsed = useBalanceManagementStore((s) => s.setUsed);
  const setAnnualMax = useBalanceManagementStore((s) => s.setAnnualMax);
  const showToast = useUIStore((s) => s.showToast);

  const [editUsed, setEditUsed] = useState(balance.used);
  const [editAnnualMax, setEditAnnualMax] = useState(balance.annualMax);

  const hasChanges = editUsed !== balance.used || editAnnualMax !== balance.annualMax;
  const canTakeCredit = balance.type === 'vacation';
  const maxUsable = canTakeCredit ? editAnnualMax : balance.acquired;
  const isInvalid = editUsed < 0 || editAnnualMax < 0 || editUsed > maxUsable;
  const isOnCredit = canTakeCredit && editUsed > balance.acquired && editUsed <= editAnnualMax;

  function handleSave() {
    if (isInvalid || !hasChanges) return;
    if (editAnnualMax !== balance.annualMax) {
      setAnnualMax(employeeId, balance.type as LeaveType, editAnnualMax);
    }
    if (editUsed !== balance.used) {
      setUsed(employeeId, balance.type as LeaveType, editUsed);
    }
    showToast('Solde mis a jour');
    onClose();
  }

  return (
    <div className="mt-2 bg-background rounded-[10px] p-3 animate-slide-down">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: balance.color }} />
        <span className="text-[13px] font-semibold text-text">{balance.label}</span>
      </div>

      {/* Accrual info */}
      <div className="bg-surface rounded-[8px] p-2 mb-3 text-[11px] text-text-secondary">
        {balance.monthlyRate > 0
          ? `Taux : ${balance.monthlyRate}j/mois → ${balance.acquired}j acquis`
          : `Forfait annuel : ${balance.annualMax}j (alloue en debut d'annee)`}
        {canTakeCredit && (
          <span className="block mt-0.5 text-amber-600 font-medium">Credit autorise jusqu'au max annuel</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11px] text-text-secondary mb-1">Jours pris</label>
          <input
            type="number"
            min={0}
            max={maxUsable}
            value={editUsed}
            onChange={(e) => setEditUsed(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-text text-[14px] text-center font-semibold focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-[11px] text-text-secondary mb-1">Max annuel</label>
          <input
            type="number"
            min={0}
            value={editAnnualMax}
            onChange={(e) => setEditAnnualMax(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full h-10 px-3 rounded-[8px] border border-border bg-surface text-text text-[14px] text-center font-semibold focus:border-primary focus:outline-none transition-colors"
          />
        </div>
      </div>

      {isOnCredit && (
        <div className="bg-amber-50 border border-amber-200 rounded-[6px] px-2 py-1.5 mb-2">
          <p className="text-[11px] text-amber-700 font-medium">
            {Math.round((editUsed - balance.acquired) * 100) / 100}j a credit (anticipe sur droits annuels)
          </p>
        </div>
      )}

      {isInvalid && (
        <p className="text-[12px] text-red-500 font-medium mb-2">
          {canTakeCredit
            ? `Maximum annuel depasse (max ${editAnnualMax}j)`
            : `Les jours pris ne peuvent pas depasser les jours acquis (${balance.acquired})`}
        </p>
      )}

      <div className="flex gap-2">
        <button type="button" onClick={onClose} className="flex-1 h-9 rounded-[8px] border border-border text-[13px] font-medium text-text-secondary active:bg-border transition-colors">
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || isInvalid}
          className={`flex-1 h-9 rounded-[8px] text-[13px] font-semibold text-white transition-all ${
            !hasChanges || isInvalid
              ? 'bg-primary opacity-40 cursor-not-allowed'
              : 'bg-primary active:bg-primary-dark active:scale-[0.98]'
          }`}
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}

/* ─── Employee Card ─── */

interface EmployeeCardProps {
  employee: typeof EMPLOYEES[0];
  balances: EmployeeLeaveBalance[];
  isExpanded: boolean;
  onToggle: () => void;
}

function EmployeeCard({ employee, balances, isExpanded, onToggle }: EmployeeCardProps) {
  const [editingType, setEditingType] = useState<LeaveType | null>(null);

  const totalAcquired = balances.reduce((sum, b) => sum + b.acquired, 0);
  const totalUsed = balances.reduce((sum, b) => sum + b.used, 0);
  const totalRemaining = Math.round((totalAcquired - totalUsed) * 100) / 100;

  return (
    <div className="bg-surface rounded-[16px] shadow-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 text-left active:bg-background transition-colors"
      >
        <Avatar initials={employee.initials} color={employee.color} size="md" />

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-text truncate">{employee.name}</p>
          <p className="text-[12px] text-text-secondary">{employee.department} · {employee.role}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[14px] font-bold text-primary">{totalRemaining}</p>
            <p className="text-[10px] text-text-tertiary">disponibles</p>
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`text-text-tertiary transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expanded */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-slide-down">
          {/* Summary */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[12px] text-text-secondary">
              {totalUsed}j pris · {Math.round(totalAcquired * 100) / 100}j acquis
            </span>
          </div>

          {/* Balance rows */}
          <div className="space-y-2">
            {balances.map((b) => {
              const remaining = Math.round((b.acquired - b.used) * 100) / 100;
              const isEditing = editingType === b.type;
              const hasCredit = b.type === 'vacation' && b.used > b.acquired;

              return (
                <div key={b.type}>
                  <button
                    type="button"
                    onClick={() => setEditingType(isEditing ? null : b.type as LeaveType)}
                    className="w-full flex items-center gap-2 py-2 px-2 rounded-[8px] hover:bg-background active:bg-background transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-[12px] text-text truncate block">{b.label}</span>
                      {hasCredit && (
                        <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          {Math.round((b.used - b.acquired) * 100) / 100}j credit
                        </span>
                      )}
                    </div>

                    {/* Dual progress bar: acquired vs annualMax background, used vs acquired foreground */}
                    <div className="w-20 flex-shrink-0">
                      <div className="h-1.5 bg-border rounded-full overflow-hidden relative">
                        {/* Acquired zone */}
                        <div
                          className="absolute h-full rounded-full opacity-30"
                          style={{
                            width: `${b.annualMax > 0 ? (b.acquired / b.annualMax) * 100 : 0}%`,
                            backgroundColor: b.color,
                          }}
                        />
                        {/* Used zone */}
                        <div
                          className="absolute h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${b.annualMax > 0 ? (b.used / b.annualMax) * 100 : 0}%`,
                            backgroundColor: b.color,
                          }}
                        />
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-text w-20 text-right flex-shrink-0">
                      {remaining}/{b.acquired}
                      <span className="text-text-tertiary">/{b.annualMax}</span>
                    </span>

                    {/* Edit icon */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary flex-shrink-0">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>

                  {isEditing && (
                    <BalanceEditor
                      balance={b}
                      employeeId={employee.id}
                      onClose={() => setEditingType(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Screen ─── */

export function ManageBalancesScreen() {
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('Tous');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const employeeBalances = useBalanceManagementStore((s) => s.employeeBalances);

  const filtered = useMemo(() => {
    return EMPLOYEES.filter((emp) => {
      const matchDept = activeDept === 'Tous' || emp.department === activeDept;
      const matchSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [search, activeDept]);

  const handleToggle = useCallback((id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalAcquired = 0;
    let totalUsed = 0;
    let totalAnnualMax = 0;
    for (const emp of filtered) {
      const balances = employeeBalances[emp.id] ?? [];
      for (const b of balances) {
        totalAcquired += b.acquired;
        totalUsed += b.used;
        totalAnnualMax += b.annualMax;
      }
    }
    return {
      employees: filtered.length,
      available: Math.round((totalAcquired - totalUsed) * 100) / 100,
      acquired: Math.round(totalAcquired * 100) / 100,
      annualMax: totalAnnualMax,
    };
  }, [filtered, employeeBalances]);

  return (
    <div className="py-4 px-5 pb-6 space-y-4">
      {/* Month navigator */}
      <MonthNavigator />

      {/* Accrual info */}
      <AccrualInfoCard />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
          <p className="text-lg font-bold text-primary">{stats.available}</p>
          <p className="text-[10px] text-text-secondary">Disponibles</p>
        </div>
        <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
          <p className="text-lg font-bold text-approved">{stats.acquired}</p>
          <p className="text-[10px] text-text-secondary">Acquis</p>
        </div>
        <div className="bg-surface rounded-[12px] shadow-sm p-3 text-center">
          <p className="text-lg font-bold text-text-secondary">{stats.annualMax}</p>
          <p className="text-[10px] text-text-secondary">Max annuel</p>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un collaborateur..." />

      {/* Department filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {DEPARTMENTS.map((dept) => (
          <FilterChip key={dept} label={dept} active={activeDept === dept} onClick={() => setActiveDept(dept)} />
        ))}
      </div>

      {/* Employee list */}
      {filtered.length === 0 ? (
        <EmptyState icon="👥" title="Aucun collaborateur trouve" subtitle="Essayez de modifier vos filtres" />
      ) : (
        <div className="space-y-3">
          {filtered.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              balances={employeeBalances[emp.id] ?? []}
              isExpanded={expandedId === emp.id}
              onToggle={() => handleToggle(emp.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
