export const Role = {
  SUPER_ADMIN: 'super_admin',
  MANAGER: 'manager',
  STAFF: 'staff',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
