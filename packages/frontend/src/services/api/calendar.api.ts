import api from './client';

interface CalendarDay {
  date: string;
  leaves: {
    employeeId: number;
    employeeName: string;
    type: string;
    color: string;
  }[];
}

interface TodayAbsence {
  employeeId: number;
  employeeName: string;
  initials: string;
  color: string;
  type: string;
  typeLabel: string;
}

export const calendarApi = {
  getMonth: async (year: number, month: number): Promise<CalendarDay[]> => {
    const { data } = await api.get<CalendarDay[]>('/calendar', {
      params: { year, month: month + 1 },
    });
    return data;
  },

  getTodayAbsences: async (): Promise<TodayAbsence[]> => {
    const { data } = await api.get<TodayAbsence[]>('/calendar/today');
    return data;
  },
};
