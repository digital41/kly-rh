import { useMemo } from 'react';
import { useCalendarStore } from '@/stores/calendar.store';
import { useUIStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';
import { SummaryStrip } from '@/components/calendar/SummaryStrip';
import { UpcomingLeave } from '@/components/calendar/UpcomingLeave';
import { MonthNav } from '@/components/calendar/MonthNav';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { LegendStrip } from '@/components/calendar/LegendStrip';
import { DayDetail } from '@/components/calendar/DayDetail';
import { TodayAbsences } from '@/components/calendar/TodayAbsences';
import { toDateString } from '@kly-rh/shared';

export function CalendarScreen() {
  const { currentMonth, currentYear, changeMonth, rangeStart, rangeEnd, clearRange } =
    useCalendarStore();
  const openSheetWithDates = useUIStore((s) => s.openSheetWithDates);
  const user = useAuthStore((s) => s.user);
  const isManager = user?.role === 'manager';

  const rangeLabel = useMemo(() => {
    if (rangeStart === null) return null;
    const start = new Date(currentYear, currentMonth, rangeStart);
    const startStr = start.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    if (rangeEnd === null) {
      return `${startStr} — selectionnez la fin`;
    }
    const end = new Date(currentYear, currentMonth, rangeEnd);
    const endStr = end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    // Count only weekdays (Mon-Fri)
    let weekdays = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const dow = cur.getDay();
      if (dow !== 0 && dow !== 6) weekdays++;
      cur.setDate(cur.getDate() + 1);
    }
    weekdays = Math.max(weekdays, 1);
    return `${startStr} → ${endStr} (${weekdays} jour${weekdays > 1 ? 's' : ''} ouvres)`;
  }, [rangeStart, rangeEnd, currentMonth, currentYear]);

  function handleRequestLeave() {
    if (rangeStart === null) return;
    const startDate = toDateString(new Date(currentYear, currentMonth, rangeStart));
    const endDate = toDateString(
      new Date(currentYear, currentMonth, rangeEnd ?? rangeStart),
    );
    clearRange();
    openSheetWithDates(startDate, endDate);
  }

  return (
    <div className="pt-4 pb-6">
      <div className="space-y-4">
        <SummaryStrip />

        <UpcomingLeave />

        <div>
          <MonthNav
            month={currentMonth}
            year={currentYear}
            onChangeMonth={changeMonth}
          />
          <CalendarGrid />
          <LegendStrip />
        </div>

        {/* Range selection bar */}
        {rangeStart !== null && (
          <div className="mx-5 bg-primary-lighter rounded-[12px] p-3 flex items-center justify-between animate-slide-down">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-primary truncate">
                {rangeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={clearRange}
                className="text-[12px] font-medium text-text-secondary px-2 py-1 rounded-[6px] hover:bg-background transition-colors"
              >
                Annuler
              </button>
              {rangeEnd !== null && (
                <button
                  onClick={handleRequestLeave}
                  className="text-[12px] font-semibold text-white bg-primary px-3 py-1.5 rounded-[8px] active:scale-95 transition-transform"
                >
                  Demander
                </button>
              )}
            </div>
          </div>
        )}

        {isManager && <DayDetail />}

        {isManager && <TodayAbsences />}
      </div>
    </div>
  );
}
