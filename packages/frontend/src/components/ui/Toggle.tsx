interface ToggleProps {
  on: boolean;
  onChange: (value: boolean) => void;
}

export function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-[46px] h-[26px] rounded-full transition-colors duration-200 ${
        on ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
