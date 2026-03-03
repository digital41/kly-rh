import api from './client';

interface TeamMember {
  id: number;
  name: string;
  initials: string;
  department: string;
  role: string;
  color: string;
  status: 'absent' | 'remote' | 'available';
  leaveType?: string;
  leaveLabel?: string;
}

export const teamApi = {
  getAll: async (): Promise<TeamMember[]> => {
    const { data } = await api.get<TeamMember[]>('/team');
    return data;
  },
};
