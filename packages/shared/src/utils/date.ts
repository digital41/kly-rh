export function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  return start === end ? fmt(start) : `${fmt(start)} — ${fmt(end)}`;
}

export function formatFullDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}
