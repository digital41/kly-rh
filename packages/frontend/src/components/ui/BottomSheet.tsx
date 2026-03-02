import type { ReactNode } from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 z-25 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`absolute bottom-0 left-0 right-0 z-30 bg-surface rounded-t-[24px] max-h-[88%] overflow-y-auto transition-transform ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transitionDuration: '350ms',
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-4">
          <h2 className="text-[17px] font-bold text-text">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center"
            aria-label="Fermer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pb-8">{children}</div>
      </div>
    </>
  );
}
