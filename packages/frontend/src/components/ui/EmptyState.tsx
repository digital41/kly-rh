interface EmptyStateProps {
  icon: string;
  title: string;
  subtitle?: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <p className="text-[15px] font-semibold text-text">{title}</p>
      {subtitle && (
        <p className="text-[13px] text-text-secondary mt-1">{subtitle}</p>
      )}
    </div>
  );
}
