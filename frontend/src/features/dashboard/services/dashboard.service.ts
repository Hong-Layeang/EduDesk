import api from '@/lib/api';
import type { ApiResponse } from '@/types/api-response.type';
import type { ClassSummary, DashboardStats } from '../types/dashboard.type';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data.data;
  },

  getClasses: async (): Promise<ClassSummary[]> => {
    const { data } = await api.get<ApiResponse<ClassSummary[]>>('/dashboard/classes');
    return data.data;
  },
};