import { Role } from '@/config/roles';
import { Routes } from '@/config/routes';

export const roleDefaultRoutes: Record<Role, string> = {
  [Role.SUPER_ADMIN]: Routes.superAdmin.dashboard,
  [Role.MANAGER]:     Routes.manager.dashboard,
  [Role.STAFF]:       Routes.staff.dashboard,
};

const roleRoutePrefix: Record<Role, string> = {
  [Role.SUPER_ADMIN]: '/super-admin',
  [Role.MANAGER]:     '/manager',
  [Role.STAFF]:       '/staff',
};

export function getDefaultRoute(role: Role): string {
  return roleDefaultRoutes[role] ?? Routes.login;
}

export function canAccessRoute(role: Role, pathname: string): boolean {
  return pathname.startsWith(roleRoutePrefix[role]);
}
