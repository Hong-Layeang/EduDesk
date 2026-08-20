import { Role } from '@/config/roles';
import { Routes } from '@/config/routes';

export const roleDefaultRoutes: Record<Role, string> = {
  [Role.TEACHER]: Routes.teacher.dashboard,
};

const teacherRoutePrefixes = ['/dashboard', '/students', '/scores', '/reports'];

const roleRoutePrefix: Record<Role, string[]> = {
  [Role.TEACHER]: teacherRoutePrefixes,
};

export function getDefaultRoute(role: Role): string {
  return roleDefaultRoutes[role] ?? Routes.login;
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  return roleRoutePrefix[role]?.some((prefix) => pathname.startsWith(prefix)) ?? false;
}
