export const Role = {
  TEACHER: 'teacher',
} as const;

export type Role = (typeof Role)[keyof typeof Role];
