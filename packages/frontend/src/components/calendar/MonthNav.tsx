import { MONTHS_FR } from '@kly-rh/shared';

interface MonthNavProps {
  month: number;
  year: number;
  onChangeMonth: (dir: -1 | 1) => void;
}

export function MonthNav({ month, year, onChangeMonth }: MonthNavProps) {
  return (
    <div className="flex items-center justify-between px-5 py-2">
      <button
        onClick={() => onChangeMonth(-1)}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border transition-colors"
        aria-label="Mois précédent"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 13L7 9L11 5" />
        </svg>
      </button>

      <span className="text-[17px] font-bold text-text">
        {MONTHS_FR[month]} {year}
      </span>

      <button
        onClick={() => onChangeMonth(1)}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-border transition-colors"
        aria-label="Mois suivant"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 5L11 9L7 13" />
        </svg>
      </button>
    </div>
  );
}
