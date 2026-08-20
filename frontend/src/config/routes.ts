export const Routes = {
  login: '/login',
  forgotPassword: '/forgot-password',
  notAuthorized: '/not-authorized',

  teacher: {
    dashboard: '/dashboard',
    students: '/students',
    scores: '/scores',
    reports: '/reports',
  },
} as const;