interface SkeletonProps {
  className?: string;
}

const shimmerStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
};

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div
        className={`rounded-[8px] bg-border/60 ${className}`}
        style={shimmerStyle}
      />
    </>
  );
}
