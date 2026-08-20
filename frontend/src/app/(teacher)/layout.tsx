import { Noto_Sans_Khmer } from 'next/font/google';
import { BottomNav } from '@/components/layout/ButtonNav';

const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ['khmer'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-khmer',
});

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${notoSansKhmer.variable} min-h-screen bg-slate-50`}
      style={{ fontFamily: 'var(--font-khmer), sans-serif' }}
    >
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-50 pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  );
}