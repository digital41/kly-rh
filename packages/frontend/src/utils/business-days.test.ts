import { describe, it, expect } from 'vitest';
import { countWeekdays, formatDateLabel } from './business-days';

describe('countWeekdays', () => {
  it('returns 1 for a same-day range (weekday)', () => {
    // 2026-03-02 is a Monday
    expect(countWeekdays('2026-03-02', '2026-03-02')).toBe(1);
  });

  it('returns 5 for Monday to Friday', () => {
    // Mon 2026-03-02 to Fri 2026-03-06
    expect(countWeekdays('2026-03-02', '2026-03-06')).toBe(5);
  });

  it('returns 6 for Monday to next Monday', () => {
    // Mon 2026-03-02 to Mon 2026-03-09
    expect(countWeekdays('2026-03-02', '2026-03-09')).toBe(6);
  });

  it('returns minimum of 1 for a Saturday-Sunday range', () => {
    // Sat 2026-03-07 to Sun 2026-03-08
    expect(countWeekdays('2026-03-07', '2026-03-08')).toBe(1);
  });

  it('skips weekends within a longer range', () => {
    // Mon 2026-03-02 to Fri 2026-03-13 — two full weeks minus weekends
    // Week 1: Mon-Fri (5 days), Sat+Sun skipped
    // Week 2: Mon-Fri (5 days) = 10 weekdays
    expect(countWeekdays('2026-03-02', '2026-03-13')).toBe(10);
  });

  it('handles a two-week span correctly', () => {
    // Wed 2026-03-04 to Tue 2026-03-17
    // Mar 4(W),5(T),6(F) = 3
    // Mar 7(S),8(Su) skip
    // Mar 9(M),10(T),11(W),12(T),13(F) = 5
    // Mar 14(S),15(Su) skip
    // Mar 16(M),17(T) = 2
    // Total = 10
    expect(countWeekdays('2026-03-04', '2026-03-17')).toBe(10);
  });
});

describe('formatDateLabel', () => {
  it('returns a French formatted date label', () => {
    // 2026-03-02 is a Monday
    const label = formatDateLabel('2026-03-02');

    // French locale should produce something like "lun. 2 mars"
    // The exact format may vary by environment, so we check key parts
    expect(label).toMatch(/lun/i);
    expect(label).toMatch(/2/);
    expect(label).toMatch(/mars/i);
  });

  it('formats a mid-week date correctly', () => {
    // 2026-03-05 is a Thursday
    const label = formatDateLabel('2026-03-05');
    expect(label).toMatch(/jeu/i);
    expect(label).toMatch(/5/);
    expect(label).toMatch(/mars/i);
  });

  it('formats a weekend date correctly', () => {
    // 2026-03-07 is a Saturday
    const label = formatDateLabel('2026-03-07');
    expect(label).toMatch(/sam/i);
    expect(label).toMatch(/7/);
    expect(label).toMatch(/mars/i);
  });
});
