import React, { useMemo, useCallback } from 'react';
import { useCalendarStore } from '@/stores/calendar.store';
import { TYPE_COLORS, DAYS_FR, toDateString } from '@kly-rh/shared';
import type { LeaveType } from '@kly-rh/shared';

const DAYS_FULL_FR: Record<string, string> = {
  Lun: 'Lundi',
  Mar: 'Mardi',
  Mer: 'Mercredi',
  Jeu: 'Jeudi',
  Ven: 'Vendredi',
  Sam: 'Samedi',
  Dim: 'Dimanche',
};

interface DayDot {
  type: LeaveType;
}

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInRange: boolean;
  dots: DayDot[];
  onSelect: (day: number) => void;
}

const CalendarDay = React.memo(function CalendarDay({
  day,
  isToday,
  isSelected,
  isWeekend,
  isRangeStart,
  isRangeEnd,
  isInRange,
  dots,
  onSelect,
}: CalendarDayProps) {
  // Range background (full cell, behind the circle)
  let rangeBgClass = '';
  if (isRangeStart && isRangeEnd) {
    rangeBgClass = '';
  } else if (isRangeStart) {
    rangeBgClass = 'range-start';
  } else if (isRangeEnd) {
    rangeBgClass = 'range-end';
  } else if (isInRange) {
    rangeBgClass = 'range-mid';
  }

  // Circle styling
  let circleClass = 'relative z-10 flex flex-col items-center justify-center w-10 h-10 rounded-[8px] transition-colors';

  if (isRangeStart || isRangeEnd) {
    circleClass += ' bg-primary text-white font-bold';
  } else if (isToday) {
    circleClass += ' bg-today text-white font-bold';
  } else if (isInRange) {
    circleClass += ' text-primary font-semibold';
  } else if (isSelected) {
    circleClass += ' bg-primary-lighter text-primary font-semibold';
  } else if (isWeekend) {
    circleClass += ' text-text-tertiary';
  } else {
    circleClass += ' text-text hover:bg-background';
  }

  return (
    <button
      className={`relative flex items-center justify-center cursor-pointer ${rangeBgClass}`}
      onClick={() => onSelect(day)}
      aria-label={`Jour ${day}`}
    >
      <div className={circleClass}>
        <span className="text-[14px] leading-none">{day}</span>
        {dots.length > 0 && (
          <div className="flex gap-[3px] mt-0.5">
            {dots.slice(0, 3).map((dot, i) => (
              <span
                key={i}
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: (isRangeStart || isRangeEnd || isToday) ? 'rgba(255,255,255,0.7)' : TYPE_COLORS[dot.type] }}
              />
            ))}
          </div>
        )}
      </div>
    </button>
  );
});

export function CalendarGrid() {
  const {
    currentMonth: month,
    currentYear: year,
    selectedDay,
    rangeStart,
    rangeEnd,
    selectRange,
    getLeavesForDate,
  } = useCalendarStore();

  const today = useMemo(() => new Date(), []);
  const todayDay =
    today.getMonth() === month && today.getFullYear() === year
      ? today.getDate()
      : -1;

  const daysInMonth = useMemo(
    () => new Date(year, month + 1, 0).getDate(),
    [year, month],
  );

  const firstDayOffset = useMemo(
    () => (new Date(year, month, 1).getDay() + 6) % 7,
    [year, month],
  );

  // Pre-compute dots for all days in the month
  const dotsMap = useMemo(() => {
    const map: Record<number, DayDot[]> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = toDateString(new Date(year, month, d));
      const leaves = getLeavesForDate(dateStr);
      if (leaves.length > 0) {
        const seen = new Set<LeaveType>();
        const dots: DayDot[] = [];
        for (const l of leaves) {
          if (!seen.has(l.type)) {
            seen.add(l.type);
            dots.push({ type: l.type });
          }
        }
        map[d] = dots;
      }
    }
    return map;
  }, [year, month, daysInMonth, getLeavesForDate]);

  const handleSelect = useCallback(
    (day: number) => selectRange(day),
    [selectRange],
  );

  const cells: React.ReactNode[] = [];

  // Empty cells for offset
  for (let i = 0; i < firstDayOffset; i++) {
    cells.push(<div key={`empty-${i}`} />);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const isRangeStart = d === rangeStart;
    const isRangeEnd = d === rangeEnd;
    const isInRange =
      rangeStart !== null &&
      rangeEnd !== null &&
      d > rangeStart &&
      d < rangeEnd;

    cells.push(
      <CalendarDay
        key={d}
        day={d}
        isToday={d === todayDay && !isRangeStart && !isRangeEnd}
        isSelected={d === selectedDay && !isRangeStart}
        isWeekend={isWeekend}
        isRangeStart={isRangeStart}
        isRangeEnd={isRangeEnd}
        isInRange={isInRange}
        dots={dotsMap[d] || []}
        onSelect={handleSelect}
      />,
    );
  }

  return (
    <div className="px-5">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1" role="row">
        {DAYS_FR.map((day) => (
          <div
            key={day}
            role="columnheader"
            aria-label={DAYS_FULL_FR[day]}
            className="text-center text-[12px] font-medium text-text-tertiary py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-[2px]" role="grid" aria-label="Calendrier">{cells}</div>
    </div>
  );
}
