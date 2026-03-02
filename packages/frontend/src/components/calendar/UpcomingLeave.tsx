import { useMemo } from 'react';
import { formatDateRange, TYPE_LABELS } from '@kly-rh/shared';
import { Badge } from '@/components/ui/Badge';
import { MY_REQUESTS } from '@/services/mock/mock-data';

export function UpcomingLeave() {
  const nextLeave = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return MY_REQUESTS.find(
      (r) => r.status === 'approved' && r.start >= today,
    ) ?? null;
  }, []);

  if (!nextLeave) {
    return (
      <div className="px-5 pb-4">
        <div className="w-full bg-surface rounded-[16px] shadow-sm p-4 text-left">
          <div className="flex items-start gap-3">
            <span className="text-xl" role="img" aria-label="Calendrier">
              📅
            </span>
            <p className="text-[13px] font-bold text-text-secondary">
              Pas de conge prevu prochainement
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pb-4">
      <button
        type="button"
        className="w-full bg-surface rounded-[16px] shadow-sm p-4 text-left active:scale-[0.98] transition-transform"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl" role="img" aria-label="Avion">
            ✈️
          </span>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-text mb-1">
              Votre prochain congé
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] text-primary font-medium">
                {TYPE_LABELS[nextLeave.type]}
              </span>
              <Badge status={nextLeave.status} />
            </div>

            <p className="text-[12px] text-text-secondary mt-0.5">
              {formatDateRange(nextLeave.start, nextLeave.end)}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
