import type { LeaveType } from './leave';

export interface LeaveBalance {
  type: LeaveType;
  label: string;
  used: number;
  total: number;
  color: string;
}
