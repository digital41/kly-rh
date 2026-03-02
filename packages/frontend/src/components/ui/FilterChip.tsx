interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${
        active
          ? 'bg-primary text-white'
          : 'bg-surface text-text-secondary border border-border'
      }`}
    >
      {label}
    </button>
  );
}
