import type { EmployeeListItem, MyRequest, LeaveBalance, Notification } from '@kly-rh/shared';

export interface LeaveRecord {
  employeeId: number;
  type: 'vacation' | 'sick' | 'personal' | 'remote' | 'training';
  start: string;
  end: string;
  status: 'approved' | 'pending' | 'rejected';
  note?: string;
}

export const EMPLOYEES: EmployeeListItem[] = [
  { id: 1, name: 'Sophie Laurent', initials: 'SL', department: 'Ingénierie', role: 'Responsable', color: '#3B82F6' },
  { id: 2, name: 'Thomas Bernard', initials: 'TB', department: 'Ingénierie', role: 'Développeur', color: '#8B5CF6' },
  { id: 3, name: 'Marie Dubois', initials: 'MD', department: 'Ingénierie', role: 'Développeuse', color: '#EC4899' },
  { id: 4, name: 'Paul Martin', initials: 'PM', department: 'Ingénierie', role: 'Développeur', color: '#F97316' },
  { id: 5, name: 'Julie Rousseau', initials: 'JR', department: 'Marketing', role: 'Responsable', color: '#10B981' },
  { id: 6, name: 'Pierre Lefebvre', initials: 'PL', department: 'Marketing', role: 'Designer', color: '#6366F1' },
  { id: 7, name: 'Emma Moreau', initials: 'EM', department: 'Ingénierie', role: 'Développeuse', color: '#14B8A6' },
  { id: 8, name: 'Lucas Petit', initials: 'LP', department: 'Commercial', role: 'Chargé de compte', color: '#F43F5E' },
  { id: 9, name: 'Camille Durand', initials: 'CD', department: 'Ingénierie', role: 'Développeuse', color: '#A855F7' },
  { id: 10, name: 'Antoine Leroy', initials: 'AL', department: 'Opérations', role: 'Responsable', color: '#0EA5E9' },
  { id: 11, name: 'Chloé Roux', initials: 'CR', department: 'Marketing', role: 'Contenu', color: '#F97316' },
  { id: 12, name: 'Maxime Simon', initials: 'MS', department: 'Commercial', role: 'Chargé de compte', color: '#22C55E' },
  { id: 13, name: 'Léa Michel', initials: 'LM', department: 'Ingénierie', role: 'Qualité', color: '#EAB308' },
  { id: 14, name: 'Hugo Fontaine', initials: 'HF', department: 'Ingénierie', role: 'Développeur', color: '#3B82F6' },
  { id: 15, name: 'Manon Garcia', initials: 'MG', department: 'Opérations', role: 'Coordinatrice', color: '#EC4899' },
  { id: 16, name: 'Nathan Dupont', initials: 'ND', department: 'Commercial', role: 'Responsable', color: '#8B5CF6' },
  { id: 17, name: 'Sarah Bertrand', initials: 'SB', department: 'Marketing', role: 'Designer', color: '#10B981' },
  { id: 18, name: 'Julien Lambert', initials: 'JL', department: 'Ingénierie', role: 'DevOps', color: '#6366F1' },
  { id: 19, name: 'Laura Mercier', initials: 'LMR', department: 'Opérations', role: 'RH', color: '#F43F5E' },
  { id: 20, name: 'Alexandre Girard', initials: 'AG', department: 'Commercial', role: 'Chargé de compte', color: '#14B8A6' },
  { id: 21, name: 'Océane Bonnet', initials: 'OB', department: 'Marketing', role: 'SEO', color: '#A855F7' },
  { id: 22, name: 'Romain Faure', initials: 'RF', department: 'Ingénierie', role: 'Développeur', color: '#0EA5E9' },
  { id: 23, name: 'Inès André', initials: 'IA', department: 'Opérations', role: 'Finance', color: '#EAB308' },
  { id: 24, name: 'Théo Martinez', initials: 'TM', department: 'Commercial', role: 'Chargé de compte', color: '#22C55E' },
  { id: 25, name: 'Clara Lefevre', initials: 'CL', department: 'Ingénierie', role: 'Designer', color: '#F97316' },
  { id: 26, name: 'Mathieu Morel', initials: 'MM', department: 'Opérations', role: 'IT', color: '#3B82F6' },
  { id: 27, name: 'Zoé Fournier', initials: 'ZF', department: 'Marketing', role: 'Événements', color: '#EC4899' },
  { id: 28, name: 'Kevin Duval', initials: 'KD', department: 'Ingénierie', role: 'Développeur', color: '#8B5CF6' },
  { id: 29, name: 'Pauline Henry', initials: 'PH', department: 'Opérations', role: 'Administration', color: '#10B981' },
  { id: 30, name: 'Damien Robert', initials: 'DR', department: 'Commercial', role: 'Directeur', color: '#6366F1' },
];

export const LEAVES: LeaveRecord[] = [
  { employeeId: 3, type: 'vacation', start: '2026-03-01', end: '2026-03-05', status: 'approved' },
  { employeeId: 4, type: 'sick', start: '2026-03-02', end: '2026-03-02', status: 'approved' },
  { employeeId: 7, type: 'remote', start: '2026-03-02', end: '2026-03-06', status: 'approved' },
  { employeeId: 8, type: 'personal', start: '2026-03-09', end: '2026-03-10', status: 'approved' },
  { employeeId: 11, type: 'vacation', start: '2026-03-05', end: '2026-03-06', status: 'approved' },
  { employeeId: 14, type: 'vacation', start: '2026-03-16', end: '2026-03-20', status: 'approved' },
  { employeeId: 13, type: 'training', start: '2026-03-23', end: '2026-03-25', status: 'approved' },
  { employeeId: 17, type: 'vacation', start: '2026-03-10', end: '2026-03-13', status: 'approved' },
  { employeeId: 20, type: 'sick', start: '2026-03-18', end: '2026-03-19', status: 'approved' },
  { employeeId: 22, type: 'remote', start: '2026-03-24', end: '2026-03-28', status: 'approved' },
  { employeeId: 2, type: 'vacation', start: '2026-03-12', end: '2026-03-14', status: 'pending', note: 'Événement familial — mariage' },
  { employeeId: 9, type: 'personal', start: '2026-03-18', end: '2026-03-18', status: 'pending', note: 'Rendez-vous médical' },
  { employeeId: 1, type: 'vacation', start: '2026-03-26', end: '2026-03-28', status: 'approved' },
];

export const MY_REQUESTS: MyRequest[] = [
  { type: 'vacation', start: '2026-03-26', end: '2026-03-28', days: 3, status: 'approved', note: '' },
  { type: 'vacation', start: '2026-02-17', end: '2026-02-21', days: 5, status: 'approved', note: 'Vacances ski' },
  { type: 'sick', start: '2026-02-03', end: '2026-02-03', days: 1, status: 'approved', note: '' },
  { type: 'personal', start: '2026-01-15', end: '2026-01-15', days: 1, status: 'rejected', note: 'Déménagement' },
  { type: 'vacation', start: '2025-12-22', end: '2026-01-02', days: 8, status: 'approved', note: 'Fêtes de fin d\'année' },
  { type: 'remote', start: '2025-12-15', end: '2025-12-19', days: 5, status: 'approved', note: '' },
];

export const BALANCES: LeaveBalance[] = [
  { type: 'vacation', label: 'Congés payés', used: 7, total: 25, color: '#3B82F6' },
  { type: 'sick', label: 'Maladie', used: 2, total: 10, color: '#F97316' },
  { type: 'personal', label: 'Congés non payés', used: 1, total: 5, color: '#8B5CF6' },
  { type: 'remote', label: 'Télétravail', used: 12, total: 48, color: '#10B981' },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, icon: '✅', bgColor: 'var(--color-approved-bg)', text: 'Votre demande de <strong>congés payés</strong> du 26-28 mars a été approuvée', time: 'Il y a 2h', unread: true },
  { id: 2, icon: '📋', bgColor: 'var(--color-pending-bg)', text: '<strong>Thomas Bernard</strong> a soumis une demande de congés (12-14 mars)', time: 'Il y a 5h', unread: true },
  { id: 3, icon: '📋', bgColor: 'var(--color-pending-bg)', text: '<strong>Camille Durand</strong> a soumis une demande personnelle (18 mars)', time: 'Hier', unread: true },
  { id: 4, icon: '✅', bgColor: 'var(--color-approved-bg)', text: 'Votre demande de <strong>congés payés</strong> du 17-21 fév. a été approuvée', time: '15 fév.', unread: false },
  { id: 5, icon: '❌', bgColor: 'var(--color-rejected-bg)', text: 'Votre demande <strong>personnelle</strong> du 15 jan. a été refusée', time: '14 jan.', unread: false },
  { id: 6, icon: '💡', bgColor: 'var(--color-primary-lighter)', text: 'Rappel : il vous reste <strong>18 jours</strong> de congés payés en 2026', time: '1 jan.', unread: false },
];

export const PROFILES = {
  manager: { name: 'Sophie Laurent', initials: 'SL', role: 'Responsable Ingénierie' },
  employee: { name: 'Thomas Bernard', initials: 'TB', role: 'Développeur · Ingénierie' },
};
