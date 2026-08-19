export const Routes = {
  login: '/login',
  forgotPassword: '/forgot-password',
  notAuthorized: '/not-authorized',

  superAdmin: {
    dashboard: '/super-admin/dashboard',
    universities: '/super-admin/universities',
    canteens: '/super-admin/canteens',
    managers: '/super-admin/managers',
    subscriptions: '/super-admin/subscriptions',
    reports: '/super-admin/reports',
  },

  manager: {
    dashboard: '/manager/dashboard',
    products: '/manager/products',
    categories: '/manager/categories',
    orders: '/manager/orders',
    sales: '/manager/sales',
    staff: '/manager/staff',
    inventory: '/manager/inventory',
    payments: '/manager/payments',
    settings: '/manager/settings',
  },

  staff: {
    dashboard: '/staff/dashboard',
    pos: '/staff/pos',
    orders: '/staff/orders',
    salesHistory: '/staff/sales-history',
  },
} as const;
