import { useMemo } from 'react';
import { useCalendarStore } from '@/stores/calendar.store';
import { TYPE_LABELS, TYPE_COLORS, formatDateRange } from '@kly-rh/shared';
import { Avatar } from '@/components/ui/Avatar';

export function TodayAbsences() {
  const getLeavesForDate = useCalendarStore((s) => s.getLeavesForDate);
  const todayLeaves = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return getLeavesForDate(today);
  }, [getLeavesForDate]);

  const count = todayLeaves.length;

  return (
    <div className="px-5 pb-4">
      {/* Section title */}
      <h2 className="text-[11px] font-bold tracking-wider text-text-tertiary uppercase mb-2">
        {count > 0
          ? `Absents aujourd'hui \u00B7 ${count} personne${count > 1 ? 's' : ''}`
          : "Aujourd'hui"}
      </h2>

      {count === 0 ? (
        <div className="bg-surface rounded-[12px] shadow-sm p-4 text-center">
          <p className="text-[14px] text-text-secondary">
            Tout le monde est disponible aujourd'hui 🎉
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {todayLeaves.map((leave, i) => (
            <div
              key={i}
              className="bg-surface rounded-[12px] shadow-sm p-3 flex items-center gap-3"
            >
              <Avatar
                initials={leave.employeeInitials}
                color={leave.employeeColor}
                size="sm"
              />

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-text truncate">
                  {leave.employeeName}
                </p>
                <p className="text-[12px] text-text-secondary truncate">
                  {formatDateRange(leave.start, leave.end)}
                </p>
              </div>

              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                style={{
                  backgroundColor: `${TYPE_COLORS[leave.type]}15`,
                  color: TYPE_COLORS[leave.type],
                }}
              >
                {TYPE_LABELS[leave.type]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
