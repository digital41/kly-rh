import { create } from 'zustand';
import { EMPLOYEES } from '@/services/mock/mock-data';
import { DEPARTMENTS } from '@kly-rh/shared';

export interface ManagedEmployee {
  id: number;
  name: string;
  initials: string;
  department: string;
  role: string;
  color: string;
  email: string;
  password: string;
  hireDate: string;
  isActive: boolean;
}

/** Generate initials from full name */
function toInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 3);
}

/** Random avatar color palette */
const AVATAR_COLORS = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#10B981',
  '#6366F1', '#14B8A6', '#F43F5E', '#A855F7', '#0EA5E9',
  '#EAB308', '#22C55E',
];

function buildInitialEmployees(): ManagedEmployee[] {
  return EMPLOYEES.map((emp, i) => ({
    ...emp,
    email: `${emp.name.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@kly.fr`,
    password: 'kly2026!',
    hireDate: `${2020 + (i % 6)}-${String((i % 12) + 1).padStart(2, '0')}-01`,
    isActive: true,
  }));
}

interface EmployeeManagementState {
  employees: ManagedEmployee[];
  addEmployee: (data: Omit<ManagedEmployee, 'id' | 'initials' | 'color'>) => void;
  updateEmployee: (id: number, data: Partial<Omit<ManagedEmployee, 'id'>>) => void;
  toggleActive: (id: number) => void;
  getEmployee: (id: number) => ManagedEmployee | undefined;
  getDepartments: () => string[];
}

export const useEmployeeManagementStore = create<EmployeeManagementState>((set, get) => ({
  employees: buildInitialEmployees(),

  addEmployee: (data) =>
    set((s) => {
      const maxId = Math.max(...s.employees.map((e) => e.id), 0);
      const newEmp: ManagedEmployee = {
        ...data,
        id: maxId + 1,
        initials: toInitials(data.name),
        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      };
      return { employees: [...s.employees, newEmp] };
    }),

  updateEmployee: (id, data) =>
    set((s) => ({
      employees: s.employees.map((e) =>
        e.id === id
          ? {
              ...e,
              ...data,
              initials: data.name ? toInitials(data.name) : e.initials,
            }
          : e,
      ),
    })),

  toggleActive: (id) =>
    set((s) => ({
      employees: s.employees.map((e) =>
        e.id === id ? { ...e, isActive: !e.isActive } : e,
      ),
    })),

  getEmployee: (id) => get().employees.find((e) => e.id === id),

  getDepartments: () => {
    const depts = new Set(get().employees.map((e) => e.department));
    return ['Tous', ...Array.from(depts).sort()];
  },
}));
