import Link from 'next/link';
import { Routes } from '@/config/routes';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-900/5">
      <h1 className="text-2xl font-bold text-slate-900">ភ្លេចពាក្យសម្ងាត់?</h1>
      <p className="text-sm text-slate-400">មុខងារនេះនឹងមកដល់ឆាប់ៗនេះ</p>
      <Link
        href={Routes.login}
        className="inline-block text-sm font-medium text-primary underline underline-offset-2"
      >
        ត្រឡប់ទៅចូលគណនីវិញ
      </Link>
    </div>
  );
}