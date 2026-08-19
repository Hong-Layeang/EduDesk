import {
  LayoutDashboard, University, UtensilsCrossed, Users, CreditCard,
  BarChart3, Package, Tag, ShoppingCart, TrendingUp, UserCog,
  Warehouse, Wallet, Settings, Monitor, ClipboardList, History,
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
  [Role.SUPER_ADMIN]: [
    { label: 'Dashboard',     href: Routes.superAdmin.dashboard,     icon: LayoutDashboard },
    { label: 'Universities',  href: Routes.superAdmin.universities,  icon: University },
    { label: 'Canteens',      href: Routes.superAdmin.canteens,      icon: UtensilsCrossed },
    { label: 'Managers',      href: Routes.superAdmin.managers,      icon: Users },
    { label: 'Subscriptions', href: Routes.superAdmin.subscriptions, icon: CreditCard },
    { label: 'Reports',       href: Routes.superAdmin.reports,       icon: BarChart3 },
  ],
  [Role.MANAGER]: [
    { label: 'Dashboard',  href: Routes.manager.dashboard,  icon: LayoutDashboard },
    { label: 'Products',   href: Routes.manager.products,   icon: Package },
    { label: 'Categories', href: Routes.manager.categories, icon: Tag },
    { label: 'Orders',     href: Routes.manager.orders,     icon: ShoppingCart },
    { label: 'Sales',      href: Routes.manager.sales,      icon: TrendingUp },
    { label: 'Staff',      href: Routes.manager.staff,      icon: UserCog },
    { label: 'Inventory',  href: Routes.manager.inventory,  icon: Warehouse },
    { label: 'Payments',   href: Routes.manager.payments,   icon: Wallet },
    { label: 'Settings',   href: Routes.manager.settings,   icon: Settings },
  ],
  [Role.STAFF]: [
    { label: 'Dashboard',     href: Routes.staff.dashboard,    icon: LayoutDashboard },
    { label: 'POS',           href: Routes.staff.pos,          icon: Monitor },
    { label: 'Orders',        href: Routes.staff.orders,       icon: ClipboardList },
    { label: 'Sales History', href: Routes.staff.salesHistory, icon: History },
  ],
};
