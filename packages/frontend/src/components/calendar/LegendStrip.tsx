import { TYPE_LABELS, TYPE_COLORS } from '@kly-rh/shared';
import type { LeaveType } from '@kly-rh/shared';

const LEAVE_TYPES: LeaveType[] = ['vacation', 'sick', 'personal', 'remote', 'training'];

export function LegendStrip() {
  return (
    <div className="px-5 py-2">
      <div className="hide-scrollbar overflow-x-auto flex gap-4">
        {LEAVE_TYPES.map((type) => (
          <div key={type} className="flex items-center gap-1.5 shrink-0">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: TYPE_COLORS[type] }}
            />
            <span className="text-[11px] text-text-secondary">
              {TYPE_LABELS[type]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
