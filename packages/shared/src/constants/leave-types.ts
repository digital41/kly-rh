import type { LeaveType, LeaveStatus } from '../types/leave';

export const TYPE_COLORS: Record<LeaveType, string> = {
  vacation: '#3B82F6',
  sick: '#F97316',
  personal: '#8B5CF6',
  remote: '#10B981',
  training: '#EC4899',
};

export const TYPE_LABELS: Record<LeaveType, string> = {
  vacation: 'Congés payés',
  sick: 'Maladie',
  personal: 'Congés non payés',
  remote: 'Télétravail',
  training: 'Formation',
};

export const STATUS_LABELS: Record<LeaveStatus, string> = {
  approved: 'Approuvé',
  pending: 'En attente',
  rejected: 'Refusé',
  cancelled: 'Annulé',
};

export const LEAVE_TYPE_ICONS: Record<LeaveType, string> = {
  vacation: '🔵',
  sick: '🟠',
  personal: '🟣',
  remote: '🟢',
  training: '🩷',
};
