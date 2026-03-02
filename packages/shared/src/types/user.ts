export type UserRole = 'employee' | 'manager' | 'admin';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  departmentId: number;
  role: UserRole;
  managerId?: number;
  hireDate: string;
  isActive: boolean;
}

export interface EmployeeListItem {
  id: number;
  name: string;
  initials: string;
  department: string;
  role: string;
  color: string;
  status?: 'available' | 'out' | 'remote';
  leaveType?: string;
  leaveLabel?: string;
}

export interface Profile {
  name: string;
  initials: string;
  role: string;
}
