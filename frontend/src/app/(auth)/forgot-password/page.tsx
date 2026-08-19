import Link from 'next/link';
import { Routes } from '@/config/routes';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Forgot password</h1>
      <p className="text-sm text-muted-foreground">Feature coming soon.</p>
      <Link href={Routes.login} className="text-sm text-primary underline">
        Back to login
      </Link>
    </div>
  );
}
