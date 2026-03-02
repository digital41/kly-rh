import { useMemo } from 'react';
import { useLeaveStore } from '@/stores/leave.store';
import { FilterChip } from '@/components/ui/FilterChip';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { TYPE_LABELS, TYPE_COLORS, formatDateRange } from '@kly-rh/shared';
import type { LeaveStatus } from '@kly-rh/shared';

const FILTER_OPTIONS: { key: 'all' | LeaveStatus; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'pending', label: 'En attente' },
  { key: 'approved', label: 'Approuvees' },
  { key: 'rejected', label: 'Refusees' },
];

const BORDER_COLORS: Record<LeaveStatus, string> = {
  approved: '#22C55E',
  pending: '#EAB308',
  rejected: '#EF4444',
  cancelled: '#94A3B8',
};

export function MyRequestsScreen() {
  const { activeFilter, setFilter, myRequests, cancelRequest } = useLeaveStore();
  const requests = useMemo(() => {
    if (activeFilter === 'all') return myRequests;
    return myRequests.filter((r) => r.status === activeFilter);
  }, [myRequests, activeFilter]);

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-4">
        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.key}
              label={opt.label}
              active={activeFilter === opt.key}
              onClick={() => setFilter(opt.key)}
            />
          ))}
        </div>

        {/* Count header */}
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-text">{requests.length}</span> demande{requests.length !== 1 ? 's' : ''}
        </p>

        {/* Requests or empty state */}
        {requests.length === 0 ? (
          <EmptyState
            icon="\uD83D\uDCCB"
            title="Aucune demande"
            subtitle="Aucune demande ne correspond a ce filtre"
          />
        ) : (
          <div className="space-y-3">
            {requests.map((req, index) => (
              <div
                key={index}
                className="bg-surface rounded-[16px] shadow-md p-4"
                style={{ borderLeft: `4px solid ${BORDER_COLORS[req.status]}` }}
              >
                {/* Type + Status */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: TYPE_COLORS[req.type] }}
                    />
                    <span className="text-sm font-semibold text-text">
                      {TYPE_LABELS[req.type]}
                    </span>
                  </div>
                  <Badge status={req.status} />
                </div>

                {/* Date range */}
                <p className="text-sm text-text-secondary mb-1">
                  {formatDateRange(req.start, req.end)}
                </p>

                {/* Days count + Note */}
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <span>{req.days} jour{req.days > 1 ? 's' : ''}</span>
                  {req.note && (
                    <>
                      <span>·</span>
                      <span className="truncate">{req.note}</span>
                    </>
                  )}
                </div>

                {/* Cancel button for pending */}
                {req.status === 'pending' && (
                  <button
                    onClick={() => cancelRequest(index)}
                    className="mt-3 w-full py-2 border border-rejected text-rejected rounded-[10px] text-sm font-semibold transition-colors hover:bg-rejected-bg"
                  >
                    Annuler la demande
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
