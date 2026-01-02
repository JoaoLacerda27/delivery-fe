export const routes = {
  login: '/login',
  orders: '/orders',
  orderDetail: (id: string) => `/orders/${id}`,
  createOrder: '/orders/new',
  deliveries: '/deliveries',
  deliveryDetail: (id: string) => `/deliveries/${id}`,
  createDelivery: '/deliveries/new',
  authCallback: '/auth/callback',
};

