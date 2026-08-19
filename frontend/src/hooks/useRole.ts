import { useAuthStore } from '@/features/auth/store/auth.store';
import type { Role } from '@/config/roles';

export function useRole(): Role | null {
  return useAuthStore((state) => state.user?.role ?? null);
}
