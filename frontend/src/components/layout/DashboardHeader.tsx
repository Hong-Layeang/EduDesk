'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Routes } from '@/config/routes';

export function DashboardHeader() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push(Routes.login);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-end border-b bg-background px-6 gap-4">
      {user && <span className="text-sm text-muted-foreground">{user.name}</span>}
      <button
        onClick={handleLogout}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Logout
      </button>
    </header>
  );
}
