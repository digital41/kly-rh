export type LeaveType = 'vacation' | 'sick' | 'personal' | 'remote' | 'training';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type HalfDayPeriod = 'morning' | 'afternoon';

export interface LeaveRequest {
  id: number;
  userId: number;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: HalfDayPeriod;
  totalDays: number;
  status: LeaveStatus;
  note?: string;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewComment?: string;
  createdAt: string;
}

export interface CreateLeaveRequest {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  halfDayPeriod?: HalfDayPeriod;
  note?: string;
}

export interface LeaveWithEmployee {
  employeeId: number;
  employeeName: string;
  employeeInitials: string;
  type: LeaveType;
  start: string;
  end: string;
  status: LeaveStatus;
  note?: string;
}

export interface MyRequest {
  type: LeaveType;
  start: string;
  end: string;
  days: number;
  status: LeaveStatus;
  note: string;
}
