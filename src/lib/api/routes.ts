export const API_ROUTES = {
  products: '/api/products',
  categories: '/api/categories',
  customers: '/api/customers',
  invoices: '/api/invoices',
  sales: '/api/sales',
  sync: '/api/sync'
} as const;

export type ApiRouteKey = keyof typeof API_ROUTES;
