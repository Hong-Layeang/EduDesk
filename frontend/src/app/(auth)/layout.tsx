import { Noto_Sans_Khmer } from 'next/font/google';

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-khmer',
});

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${notoSansKhmer.variable} flex min-h-screen items-center justify-center bg-slate-50 px-4`}
      style={{ fontFamily: 'var(--font-khmer), sans-serif' }}
    >
      {children}
    </div>
  );
}