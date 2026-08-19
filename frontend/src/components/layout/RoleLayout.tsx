import { AppSidebar } from './AppSidebar';
import { DashboardHeader } from './DashboardHeader';
import type { Role } from '@/config/roles';

export function RoleLayout({ role, children }: { role: Role; children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar role={role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
