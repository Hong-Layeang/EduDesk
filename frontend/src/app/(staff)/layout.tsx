import { RoleLayout } from '@/components/layout/RoleLayout';
import { Role } from '@/config/roles';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return <RoleLayout role={Role.STAFF}>{children}</RoleLayout>;
}
