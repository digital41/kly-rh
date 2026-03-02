import { useState, useMemo } from 'react';
import { useLeaveStore } from '@/stores/leave.store';
import { useUIStore } from '@/stores/ui.store';
import { EMPLOYEES } from '@/services/mock/mock-data';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { TYPE_LABELS, TYPE_COLORS, formatDateRange } from '@kly-rh/shared';

export function ApprovalsScreen() {
  const leaves = useLeaveStore((s) => s.leaves);
  const pendingApprovals = useMemo(() => leaves.filter((l) => l.status === 'pending'), [leaves]);
  const approveLeave = useLeaveStore((s) => s.approveLeave);
  const rejectLeave = useLeaveStore((s) => s.rejectLeave);
  const showToast = useUIStore((s) => s.showToast);

  const [fadingIndices, setFadingIndices] = useState<Set<number>>(new Set());
  const [disabledIndices, setDisabledIndices] = useState<Set<number>>(new Set());
  const [rejectingIndex, setRejectingIndex] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (index: number) => {
    if (disabledIndices.has(index)) return;

    // Disable buttons to prevent double-tap
    setDisabledIndices((prev) => new Set(prev).add(index));
    // Close any open reject textarea for this card
    if (rejectingIndex === index) {
      setRejectingIndex(null);
      setRejectReason('');
    }

    setFadingIndices((prev) => new Set(prev).add(index));
    setTimeout(() => {
      approveLeave(index);
      showToast('Demande approuvee');
      setFadingIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setDisabledIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 300);
  };

  const handleRejectClick = (index: number) => {
    if (disabledIndices.has(index)) return;

    if (rejectingIndex === index) {
      // Toggle off if already showing
      setRejectingIndex(null);
      setRejectReason('');
    } else {
      setRejectingIndex(index);
      setRejectReason('');
    }
  };

  const handleConfirmReject = (index: number) => {
    if (disabledIndices.has(index)) return;

    // Disable buttons to prevent double-tap
    setDisabledIndices((prev) => new Set(prev).add(index));

    setFadingIndices((prev) => new Set(prev).add(index));
    setTimeout(() => {
      rejectLeave(index);
      showToast('Demande refusee');
      setFadingIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setDisabledIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
      setRejectingIndex(null);
      setRejectReason('');
    }, 300);
  };

  if (pendingApprovals.length === 0) {
    return (
      <div className="py-4 px-5 pb-6">
        <EmptyState
          icon="✅"
          title="Tout est a jour !"
          subtitle="Aucune approbation en attente"
        />
      </div>
    );
  }

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-3">
        {pendingApprovals.map((leave, index) => {
          const employee = EMPLOYEES.find((e) => e.id === leave.employeeId);
          if (!employee) return null;

          const isFading = fadingIndices.has(index);
          const isDisabled = disabledIndices.has(index);
          const isRejectOpen = rejectingIndex === index;

          return (
            <div
              key={`${leave.employeeId}-${leave.start}-${leave.end}`}
              className={`bg-surface rounded-[16px] shadow-md p-4 transition-all duration-300 ${
                isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            >
              {/* Employee info */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar initials={employee.initials} color={employee.color} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">
                    {employee.name}
                  </p>
                  <p className="text-xs text-text-secondary">{employee.department}</p>
                </div>
              </div>

              {/* Leave details */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${TYPE_COLORS[leave.type]}15`,
                    color: TYPE_COLORS[leave.type],
                  }}
                >
                  {TYPE_LABELS[leave.type]}
                </span>
                <span className="text-sm text-text-secondary">
                  {formatDateRange(leave.start, leave.end)}
                </span>
              </div>

              {/* Note */}
              {leave.note && (
                <p className="text-sm italic text-text-secondary mb-3">
                  {leave.note}
                </p>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleRejectClick(index)}
                  disabled={isDisabled}
                  className={`flex-1 py-2.5 border border-rejected text-rejected rounded-[10px] text-sm font-semibold transition-colors ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-rejected-bg'
                  }`}
                >
                  Refuser
                </button>
                <button
                  onClick={() => handleApprove(index)}
                  disabled={isDisabled}
                  className={`flex-1 py-2.5 bg-approved text-white rounded-[10px] text-sm font-semibold transition-colors ${
                    isDisabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:opacity-90'
                  }`}
                >
                  Approuver
                </button>
              </div>

              {/* Reject reason textarea - animated slide-down */}
              {isRejectOpen && (
                <div className="mt-3 animate-slide-down overflow-hidden">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Motif du refus (facultatif)..."
                    className="w-full min-h-[70px] px-3 py-2 rounded-[8px] border border-border bg-surface text-text text-[13px] placeholder:text-text-tertiary resize-none focus:border-rejected focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() => handleConfirmReject(index)}
                    disabled={isDisabled}
                    className={`w-full mt-2 py-2 bg-rejected text-white rounded-[10px] text-sm font-semibold transition-colors ${
                      isDisabled
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:opacity-90'
                    }`}
                  >
                    Confirmer le refus
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
