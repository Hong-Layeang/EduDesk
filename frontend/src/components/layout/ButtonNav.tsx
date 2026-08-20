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
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-xs font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600',
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}