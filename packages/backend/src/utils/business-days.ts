export function countBusinessDays(start: Date, end: Date, holidays: Date[] = []): number {
  const holidaySet = new Set(holidays.map((d) => d.toISOString().split('T')[0]));
  let count = 0;
  const current = new Date(start);

  while (current <= end) {
    const day = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    if (day !== 0 && day !== 6 && !holidaySet.has(dateStr)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}
