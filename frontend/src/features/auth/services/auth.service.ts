import api from '@/lib/api';
import type { LoginCredentials, LoginResponse } from '../types/auth.type';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout').catch(() => {});
  },
};
