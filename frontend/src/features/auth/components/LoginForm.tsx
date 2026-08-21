'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { getDefaultRoute } from '@/lib/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function LoginForm() {
  const { login, isLoading, error } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    const { user } = useAuthStore.getState();
    if (user) router.push(getDefaultRoute(user.role));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5"
    >
      <div className="space-y-1 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
          ED
        </div>
        <h1 className="text-2xl font-bold text-slate-900">EduDesk</h1>
        <p className="text-sm text-slate-400">ចូលគណនីគ្រូបង្រៀនរបស់អ្នក</p>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">អ៊ីមែល</label>
          <Input
            type="email"
            placeholder="teacher@edudesk.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-500">ពាក្យសម្ងាត់</label>
          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}
      </Button>
    </form>
  );
}