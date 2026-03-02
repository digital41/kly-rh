export const DEPARTMENTS = ['Tous', 'Ingénierie', 'Marketing', 'Commercial', 'Opérations'] as const;

export type Department = (typeof DEPARTMENTS)[number];
