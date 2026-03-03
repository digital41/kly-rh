import { useState, useEffect, useMemo } from 'react';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Toggle } from '@/components/ui/Toggle';
import { useUIStore } from '@/stores/ui.store';
import { useLeaveStore } from '@/stores/leave.store';
import { TYPE_COLORS, TYPE_LABELS } from '@kly-rh/shared';
import type { LeaveType } from '@kly-rh/shared';
import { BALANCES } from '@/services/mock/mock-data';
import { ACCRUAL_RULES } from '@/stores/balance-management.store';

const LEAVE_TYPES: { key: LeaveType; label: string; color: string }[] = [
  { key: 'vacation', label: TYPE_LABELS.vacation, color: TYPE_COLORS.vacation },
  { key: 'sick', label: TYPE_LABELS.sick, color: TYPE_COLORS.sick },
  { key: 'personal', label: TYPE_LABELS.personal, color: TYPE_COLORS.personal },
  { key: 'remote', label: TYPE_LABELS.remote, color: TYPE_COLORS.remote },
];

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function countWeekdays(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return Math.max(count, 1);
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function CalendarSvg() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

type HalfDayPeriod = 'morning' | 'afternoon';

export function LeaveRequestSheet() {
  const isSheetOpen = useUIStore((s) => s.isSheetOpen);
  const sheetStartDate = useUIStore((s) => s.sheetStartDate);
  const sheetEndDate = useUIStore((s) => s.sheetEndDate);
  const closeSheet = useUIStore((s) => s.closeSheet);
  const showToast = useUIStore((s) => s.showToast);
  const submitRequest = useLeaveStore((s) => s.submitRequest);

  const [selectedType, setSelectedType] = useState<LeaveType>('vacation');
  const [startDate, setStartDate] = useState(getTomorrow);
  const [endDate, setEndDate] = useState(getTomorrow);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPeriod, setHalfDayPeriod] = useState<HalfDayPeriod>('morning');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill dates when opened from calendar selection
  useEffect(() => {
    if (isSheetOpen) {
      if (sheetStartDate) setStartDate(sheetStartDate);
      if (sheetEndDate) setEndDate(sheetEndDate);
    }
  }, [isSheetOpen, sheetStartDate, sheetEndDate]);

  // Lock end date to start date when half-day is on
  useEffect(() => {
    if (isHalfDay) {
      setEndDate(startDate);
    }
  }, [isHalfDay, startDate]);

  const dayCount = useMemo(
    () => (isHalfDay ? 0.5 : countWeekdays(startDate, endDate)),
    [startDate, endDate, isHalfDay],
  );

  // --- Validation ---
  const today = getToday();
  const isPastDate = startDate < today;

  const balanceEntry = BALANCES.find((b) => b.type === selectedType);
  const remaining = balanceEntry ? balanceEntry.total - balanceEntry.used : 0;

  // Credit logic: vacation can be taken on credit up to annualMax
  const accrualRule = ACCRUAL_RULES.find((r) => r.type === selectedType);
  const annualMax = accrualRule?.annualMax ?? 0;
  const used = balanceEntry?.used ?? 0;
  const canTakeOnCredit = selectedType === 'vacation';
  const maxAvailable = canTakeOnCredit ? annualMax - used : remaining;
  const isBalanceExceeded = dayCount > maxAvailable;

  // Credit warning: exceeds acquired but within annual max
  const creditDays = canTakeOnCredit && dayCount > remaining
    ? Math.round((dayCount - remaining) * 100) / 100
    : 0;
  const isOnCredit = creditDays > 0 && !isBalanceExceeded;

  const hasValidationError = isPastDate || isBalanceExceeded;
  const isButtonDisabled = hasValidationError || isSubmitting;

  function handleSubmit() {
    if (isButtonDisabled) return;

    setIsSubmitting(true);

    setTimeout(() => {
      submitRequest({
        type: selectedType,
        start: startDate,
        end: isHalfDay ? startDate : endDate,
        days: dayCount,
        note: isHalfDay
          ? `${halfDayPeriod === 'morning' ? 'Matin' : 'Après-midi'}${note ? ' — ' + note : ''}`
          : note,
      });

      closeSheet();

      // Reset form
      setSelectedType('vacation');
      setStartDate(getTomorrow());
      setEndDate(getTomorrow());
      setIsHalfDay(false);
      setHalfDayPeriod('morning');
      setNote('');
      setIsSubmitting(false);

      setTimeout(() => {
        showToast('Demande soumise avec succes');
      }, 400);
    }, 300);
  }

  return (
    <BottomSheet
      open={isSheetOpen}
      onClose={closeSheet}
      title="Nouvelle demande"
    >
      {/* Leave type grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {LEAVE_TYPES.map(({ key, label, color }) => {
          const isSelected = selectedType === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedType(key)}
              className={`h-[72px] rounded-[12px] border-2 flex items-center gap-3 px-3 transition-colors active:scale-[0.97] ${
                isSelected
                  ? 'border-primary bg-primary-lighter text-primary'
                  : 'border-border bg-surface text-text'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[14px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Half day toggle */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px] text-text font-medium">Demi-journee</span>
        <Toggle on={isHalfDay} onChange={setIsHalfDay} />
      </div>

      {/* Half-day period selector */}
      {isHalfDay && (
        <div className="grid grid-cols-2 gap-3 mb-4 animate-slide-down">
          <button
            type="button"
            onClick={() => setHalfDayPeriod('morning')}
            className={`h-11 rounded-[10px] border-2 text-[13px] font-semibold transition-colors ${
              halfDayPeriod === 'morning'
                ? 'border-primary bg-primary-lighter text-primary'
                : 'border-border bg-surface text-text-secondary'
            }`}
          >
            Matin
          </button>
          <button
            type="button"
            onClick={() => setHalfDayPeriod('afternoon')}
            className={`h-11 rounded-[10px] border-2 text-[13px] font-semibold transition-colors ${
              halfDayPeriod === 'afternoon'
                ? 'border-primary bg-primary-lighter text-primary'
                : 'border-border bg-surface text-text-secondary'
            }`}
          >
            Apres-midi
          </button>
        </div>
      )}

      {/* Dates section */}
      <div className="mb-5">
        <label className="block text-[11px] font-semibold text-text-secondary tracking-wider uppercase mb-2">
          {isHalfDay ? 'Date' : 'Dates'}
        </label>
        <div className={isHalfDay ? '' : 'grid grid-cols-2 gap-3'}>
          <div>
            {!isHalfDay && (
              <label className="block text-[13px] text-text-secondary mb-1.5">
                Debut
              </label>
            )}
            <div className="date-input-wrapper">
              <span className="date-icon"><CalendarSvg /></span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value > endDate) {
                    setEndDate(e.target.value);
                  }
                }}
              />
            </div>
            <p className="text-[11px] text-text-tertiary mt-1">{formatDateLabel(startDate)}</p>
          </div>
          {!isHalfDay && (
            <div>
              <label className="block text-[13px] text-text-secondary mb-1.5">
                Fin
              </label>
              <div className="date-input-wrapper">
                <span className="date-icon"><CalendarSvg /></span>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <p className="text-[11px] text-text-tertiary mt-1">{formatDateLabel(endDate)}</p>
            </div>
          )}
        </div>

        {/* Past date validation error */}
        <div aria-live="polite">
          {isPastDate && (
            <p className="text-[12px] text-red-500 font-medium mt-2" role="alert">
              La date de debut doit etre dans le futur
            </p>
          )}
        </div>

        {/* Day count summary */}
        <div className="mt-3 bg-primary-lighter rounded-[10px] px-3 py-2 flex items-center justify-between">
          <span className="text-[13px] text-primary font-medium">
            {isHalfDay ? `Demi-journee (${halfDayPeriod === 'morning' ? 'matin' : 'apres-midi'})` : 'Jours ouvres'}
          </span>
          <span className="text-[15px] text-primary font-bold">
            {dayCount} jour{dayCount > 1 ? 's' : ''}
          </span>
        </div>

        {/* Credit warning: within annual max but exceeds acquired */}
        {isOnCredit && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-[8px] px-3 py-2">
            <div className="flex items-center gap-2 mb-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span className="text-[12px] font-semibold text-amber-700">Conges a credit</span>
            </div>
            <p className="text-[11px] text-amber-600">
              {creditDays} jour{creditDays > 1 ? 's' : ''} pris par anticipation sur vos droits annuels ({annualMax}j)
            </p>
          </div>
        )}

        {/* Balance exceeded validation error */}
        {isBalanceExceeded && (
          <p className="text-[12px] text-red-500 font-medium mt-2">
            {canTakeOnCredit
              ? `Maximum annuel depasse (${annualMax - used} jours restants sur ${annualMax})`
              : `Solde insuffisant (${remaining} jours restants)`}
          </p>
        )}
      </div>

      {/* Note textarea */}
      <div className="mb-6">
        <label className="block text-[11px] font-semibold text-text-secondary tracking-wider uppercase mb-2">
          Note (facultatif)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ajouter une note pour votre responsable..."
          className="w-full min-h-[80px] px-3 py-2 rounded-[8px] border border-border bg-surface text-text text-[14px] placeholder:text-text-tertiary resize-none focus:border-primary focus:outline-none transition-colors"
        />
      </div>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isButtonDisabled}
        className={`w-full h-12 bg-primary text-white font-semibold rounded-[12px] transition-all ${
          isButtonDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'active:bg-primary-dark active:scale-[0.98]'
        }`}
      >
        {isSubmitting ? 'Envoi...' : 'Soumettre la demande'}
      </button>
    </BottomSheet>
  );
}
