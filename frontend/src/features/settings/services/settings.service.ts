import api from '@/lib/api';
import type { CanteenSettings } from '../types/settings.type';
export const settingsService = {
  getAll: async (): Promise<CanteenSettings[]> => { const { data } = await api.get<CanteenSettings[]>('/settings'); return data; },
};
