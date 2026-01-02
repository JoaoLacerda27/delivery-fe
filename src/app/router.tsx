import { createBrowserRouter } from 'react-router-dom';
import { routes } from './routes';
import LoginPage from '@/features/auth/pages/LoginPage';
import GoogleCallbackPage from '@/features/auth/pages/GoogleCallbackPage';
import OrdersPage from '@/features/orders/pages/OrdersPage';
import CreateOrderPage from '@/features/orders/pages/CreateOrderPage';
import OrderDetailPage from '@/features/orders/pages/OrderDetailPage';
import DeliveriesPage from '@/features/deliveries/pages/DeliveriesPage';
import CreateDeliveryPage from '@/features/deliveries/pages/CreateDeliveryPage';
import DeliveryDetailsPage from '@/features/deliveries/pages/DeliveryDetailsPage';
import MainLayout from '@/shared/layouts/MainLayout';
import PrivateRoute from './PrivateRoute';

export const router = createBrowserRouter([
  {
    path: routes.login,
    element: <LoginPage />,
  },
  {
    path: routes.authCallback,
    element: <GoogleCallbackPage />,
  },
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: routes.orders,
        element: <OrdersPage />,
      },
      {
        path: routes.createOrder,
        element: <CreateOrderPage />,
      },
      {
        path: '/orders/:orderId',
        element: <OrderDetailPage />,
      },
      {
        path: routes.deliveries,
        element: <DeliveriesPage />,
      },
      {
        path: routes.createDelivery,
        element: <CreateDeliveryPage />,
      },
      {
        path: '/deliveries/:deliveryId',
        element: <DeliveryDetailsPage />,
      },
    ],
  },
]);

