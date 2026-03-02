import type { LeaveStatus } from '@kly-rh/shared';
import { STATUS_LABELS } from '@kly-rh/shared';

const badgeStyles: Record<LeaveStatus, string> = {
  approved: 'bg-approved-bg text-approved',
  pending: 'bg-pending-bg text-pending',
  rejected: 'bg-rejected-bg text-rejected',
  cancelled: 'bg-cancelled-bg text-cancelled',
};

interface BadgeProps {
  status: LeaveStatus;
}

export function Badge({ status }: BadgeProps) {
  return (
    <span
      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badgeStyles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
