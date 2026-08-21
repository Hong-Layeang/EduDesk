import Link from 'next/link';
import { Noto_Sans_Khmer } from 'next/font/google';
import { Routes } from '@/config/routes';

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
});

export default function NotAuthorizedPage() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center"
      style={{ fontFamily: notoSansKhmer.style.fontFamily }}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-2xl font-bold text-destructive">
        ៤០៣
      </div>
      <h1 className="text-xl font-bold text-slate-900">មិនមានសិទ្ធិចូលប្រើទេ</h1>
      <p className="max-w-xs text-sm text-slate-400">អ្នកមិនមានសិទ្ធិចូលមើលទំព័រនេះទេ</p>
      <Link href={Routes.login} className="text-sm font-medium text-primary underline underline-offset-2">
        ត្រឡប់ទៅចូលគណនីវិញ
      </Link>
    </div>
  );
}