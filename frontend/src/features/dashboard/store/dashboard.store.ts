import { create } from 'zustand';
import { dashboardService } from '../services/dashboard.service';
import type { ClassSummary, DashboardStats } from '../types/dashboard.type';

interface DashboardState {
  stats: DashboardStats | null;
  classes: ClassSummary[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  stats: null,
  classes: [],
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const [stats, classes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getClasses(),
      ]);
      set({ stats, classes, isLoading: false });
    } catch {
      set({
        error: 'មិនអាចទាញយកទិន្នន័យផ្ទាំងគ្រប់គ្រងបានទេ សូមព្យាយាមម្ដងទៀត',
        isLoading: false,
      });
    }
  },
}));