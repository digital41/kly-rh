import { useUIStore } from '@/stores/ui.store';

export function Toast() {
  const message = useUIStore((s) => s.toastMessage);

  if (!message) return null;

  return (
    <div role="alert" aria-live="polite" aria-atomic="true" className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-text text-white text-sm font-medium rounded-[12px] shadow-lg animate-slide-down whitespace-nowrap">
      {message}
    </div>
  );
}
