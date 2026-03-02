import { BALANCES, MY_REQUESTS } from '@/services/mock/mock-data';
import { formatDateRange, STATUS_LABELS } from '@kly-rh/shared';
import type { LeaveStatus } from '@kly-rh/shared';

const STATUS_ICONS: Record<LeaveStatus, string> = {
  approved: '\u2705',
  pending: '\u23F3',
  rejected: '\u274C',
  cancelled: '\u{1F6AB}',
};

export function BalanceScreen() {
  const totalUsed = BALANCES.reduce((sum, b) => sum + b.used, 0);
  const totalAllocated = BALANCES.reduce((sum, b) => sum + b.total, 0);
  const vacationBalance = BALANCES.find((b) => b.type === 'vacation');
  const vacationRemaining = vacationBalance
    ? vacationBalance.total - vacationBalance.used
    : 0;

  const recentHistory = MY_REQUESTS.slice(0, 4);

  return (
    <div className="py-4 px-5 pb-6">
      <div className="space-y-4">
        {/* Year summary card */}
        <div className="bg-primary text-white rounded-[16px] p-5">
          <p className="text-[15px] font-bold mb-4">Bilan {new Date().getFullYear()}</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-2xl font-bold">{totalUsed}</p>
              <p className="text-[11px] opacity-80">Jours pris</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalAllocated}</p>
              <p className="text-[11px] opacity-80">Jours alloues</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{vacationRemaining}</p>
              <p className="text-[11px] opacity-80">Conges restants</p>
            </div>
          </div>
        </div>

        {/* Balance cards */}
        {BALANCES.map((balance) => {
          const remaining = balance.total - balance.used;
          const percentage = balance.total > 0 ? (balance.used / balance.total) * 100 : 0;

          return (
            <div
              key={balance.type}
              className="bg-surface rounded-[16px] shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: balance.color }}
                  />
                  <span className="text-sm font-semibold text-text">
                    {balance.label}
                  </span>
                </div>
                <span className="text-sm text-text-secondary">
                  {balance.used}/{balance.total}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: balance.color,
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                />
              </div>

              <p className="text-xs text-text-secondary mt-2">
                {remaining} jours restants
              </p>
            </div>
          );
        })}

        {/* Recent history */}
        <div>
          <p className="text-[12px] font-semibold text-text-secondary tracking-wider uppercase mb-3">
            HISTORIQUE RECENT
          </p>
          <div className="bg-surface rounded-[16px] shadow-sm divide-y divide-border">
            {recentHistory.map((req, index) => {
              const typeLabel =
                req.type === 'vacation'
                  ? 'Conges payes'
                  : req.type === 'sick'
                    ? 'Maladie'
                    : req.type === 'personal'
                      ? 'Personnel'
                      : req.type === 'remote'
                        ? 'Teletravail'
                        : 'Formation';

              return (
                <div key={index} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-lg shrink-0">
                    {STATUS_ICONS[req.status]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text">{typeLabel}</p>
                    <p className="text-xs text-text-secondary">
                      {formatDateRange(req.start, req.end)}
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary shrink-0">
                    {STATUS_LABELS[req.status]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
