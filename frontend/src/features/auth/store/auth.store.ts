import { create } from 'zustand';
import { cookies } from '@/lib/cookies';
import { authService } from '../services/auth.service';
import type { AuthState, LoginCredentials } from '../types/auth.type';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const { access_token, user } = await authService.login(credentials);
      cookies.setToken(access_token);
      cookies.setRole(user.role);
      set({ user, token: access_token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ error: 'Invalid email or password', isLoading: false });
    }
  },

  logout: () => {
    cookies.clearAll();
    set(initialState);
  },

  clearError: () => set({ error: null }),
}));
