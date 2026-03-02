interface AvatarProps {
  initials: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-base',
};

export function Avatar({ initials, color, size = 'md' }: AvatarProps) {
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
