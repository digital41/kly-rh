import { useCalendarStore } from '@/stores/calendar.store';
import {
  TYPE_LABELS,
  TYPE_COLORS,
  formatDateRange,
  formatFullDate,
} from '@kly-rh/shared';
import { Badge } from '@/components/ui/Badge';

export function DayDetail() {
  const { currentMonth: month, currentYear: year, selectedDay, getLeavesForDate } =
    useCalendarStore();

  if (selectedDay === null) return null;

  const date = new Date(year, month, selectedDay);
  const dateStr = date.toISOString().split('T')[0];
  const leaves = getLeavesForDate(dateStr);
  const fullDate = formatFullDate(date);

  return (
    <div className="animate-slide-down px-5 pb-3">
      <div className="bg-surface rounded-[12px] shadow-sm p-4">
        {/* Header */}
        <h3 className="text-[15px] font-bold text-text capitalize mb-3">
          {fullDate}
        </h3>

        {leaves.length === 0 ? (
          <p className="text-[13px] text-text-secondary">Aucune absence</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {leaves.map((leave, i) => (
              <div key={i} className="flex items-start gap-2.5">
                {/* Colored dot */}
                <span
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[leave.type] }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[14px] font-semibold text-text">
                      {leave.employeeName}
                    </span>
                    <Badge status={leave.status} />
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="text-[12px] font-medium"
                      style={{ color: TYPE_COLORS[leave.type] }}
                    >
                      {TYPE_LABELS[leave.type]}
                    </span>
                    <span className="text-text-tertiary text-[12px]">
                      {formatDateRange(leave.start, leave.end)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
