interface FabProps {
  onClick: () => void;
  visible: boolean;
}

export function Fab({ onClick, visible }: FabProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute right-5 bottom-20 z-15 w-14 h-14 rounded-full bg-primary text-white shadow-fab flex items-center justify-center transition-transform duration-200 active:scale-[0.92] ${
        visible ? 'scale-100' : 'scale-0'
      }`}
      aria-label="Nouvelle demande"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  );
}
