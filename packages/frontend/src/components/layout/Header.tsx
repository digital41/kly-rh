interface HeaderProps {
  title: string;
  showBack: boolean;
  onBack: () => void;
  showAvatar: boolean;
  initials: string;
  onAvatarClick?: () => void;
}

export function Header({ title, showBack, onBack, showAvatar, initials, onAvatarClick }: HeaderProps) {
  const isBrand = title === 'KLY Conges';

  return (
    <header className="absolute top-0 left-0 right-0 z-10 h-14 bg-surface flex items-center px-5 shadow-sm">
      {showBack ? (
        <>
          <button
            onClick={onBack}
            className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-border transition-colors -ml-1"
            aria-label="Retour a la page precedente"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="flex-1 text-center text-[17px] font-bold text-text">
            {title}
          </span>
          {/* Spacer to balance the back button */}
          <div className="w-11" />
        </>
      ) : (
        <>
          <span
            className={`text-[17px] font-bold ${
              isBrand ? 'text-primary' : 'text-text'
            }`}
          >
            {isBrand ? 'KLY Conges' : title}
          </span>
          <div className="flex-1" />
          {showAvatar && (
            <button
              onClick={onAvatarClick}
              className="w-11 h-11 rounded-full bg-primary-light text-white text-xs font-semibold flex items-center justify-center active:scale-90 transition-transform"
              aria-label="Profil"
            >
              {initials}
            </button>
          )}
        </>
      )}
    </header>
  );
}
