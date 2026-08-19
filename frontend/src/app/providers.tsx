'use client';

import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { cookies } from '@/lib/cookies';
import type { Role } from '@/config/roles';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
  exp: number;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const token = cookies.getToken();
    if (!token) return;
    try {
      const payload = jwtDecode<JwtPayload>(token);
      if (Date.now() / 1000 > payload.exp) {
        cookies.clearAll();
        return;
      }
      useAuthStore.setState({
        user: { id: payload.sub, email: payload.email, name: payload.name, role: payload.role },
        token,
        isAuthenticated: true,
      });
    } catch {
      cookies.clearAll();
    }
  }, []);

  return <TooltipProvider>{children}</TooltipProvider>;
}
