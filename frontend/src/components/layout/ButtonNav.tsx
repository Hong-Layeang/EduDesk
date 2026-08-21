'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart3, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'ទំព័រដើម', icon: Home },
  { href: '/students', label: 'សិស្ស', icon: Users },
  { href: '/scores', label: 'ពិន្ទុ', icon: BarChart3 },
  { href: '/reports', label: 'របាយការណ៍', icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-1 px-1 py-1">
              <span
                className={cn(
                  'flex h-8 w-14 items-center justify-center rounded-full transition-colors',
                  isActive ? 'bg-primary/10' : 'bg-transparent',
                )}
              >
                <Icon
                  className={cn('h-5 w-5 transition-colors', isActive ? 'text-primary' : 'text-slate-400')}
                />
              </span>
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-slate-400',
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}