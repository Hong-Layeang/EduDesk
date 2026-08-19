import Link from 'next/link';
import { Routes } from '@/config/routes';

export default function NotAuthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">403 — Not Authorized</h1>
      <p className="text-muted-foreground">You don&apos;t have permission to access this page.</p>
      <Link href={Routes.login} className="text-primary underline">
        Back to login
      </Link>
    </div>
  );
}
