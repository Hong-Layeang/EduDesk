'use client';

import { sidebarConfig } from '@/config/sidebar';
import { env } from '@/config/env';
import { SidebarMenuItem } from './SidebarMenuItem';
import type { Role } from '@/config/roles';

export function AppSidebar({ role }: { role: Role }) {
  const items = sidebarConfig[role];

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-sidebar">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-semibold text-sidebar-foreground">{env.appName}</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => (
          <SidebarMenuItem key={item.href} item={item} />
        ))}
      </nav>
    </aside>
  );
}
