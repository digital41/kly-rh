import { BALANCES } from '@/services/mock/mock-data';

export function SummaryStrip() {
  const totalRemaining = BALANCES.reduce(
    (sum, b) => sum + (b.total - b.used),
    0,
  );

  return (
    <div className="relative py-2">
      {/* Scroll container — separate from flex layout */}
      <div
        className="hide-scrollbar"
        style={{
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorX: 'contain',
        }}
      >
        {/* Flex row — width: max-content forces it wider than the scroll container */}
        <div
          className="flex gap-2 px-5"
          style={{ width: 'max-content' }}
        >
          {/* Total chip */}
          <div className="bg-primary text-white text-[13px] font-bold px-3.5 py-1.5 rounded-full select-none whitespace-nowrap">
            {totalRemaining}j restants
          </div>

          {/* Type chips */}
          {BALANCES.map((b) => (
            <div
              key={b.type}
              className="bg-surface border border-border text-[13px] text-text-secondary px-3 py-1.5 rounded-full flex items-center gap-1.5 select-none whitespace-nowrap"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: b.color }}
              />
              {b.label}
              <span className="font-semibold text-text">
                {b.total - b.used}
              </span>
            </div>
          ))}

          {/* Right spacer so last chip doesn't clip */}
          <div className="w-4" aria-hidden="true" />
        </div>
      </div>

      {/* Right fade hint — signals more content */}
      <div
        className="absolute top-0 right-0 bottom-0 w-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to left, var(--color-background), transparent)',
        }}
      />
    </div>
  );
}
