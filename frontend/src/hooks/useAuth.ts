import { useAuthStore } from '@/features/auth/store/auth.store';

export function useAuth() {
  return useAuthStore();
}
