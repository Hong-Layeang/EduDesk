import {
  LayoutDashboard, Users, ClipboardList, FileSpreadsheet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Routes } from './routes';
import { Role } from './roles';

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarConfig: Record<Role, SidebarItem[]> = {
  [Role.TEACHER]: [
    { label: 'Dashboard', href: Routes.teacher.dashboard, icon: LayoutDashboard },
    { label: 'Students', href: Routes.teacher.students, icon: Users },
    { label: 'Scores', href: Routes.teacher.scores, icon: ClipboardList },
    { label: 'Reports', href: Routes.teacher.reports, icon: FileSpreadsheet },
  ],
};
