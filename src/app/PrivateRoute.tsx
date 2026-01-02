import React from 'react';
import { Navigate } from 'react-router-dom';
import { routes } from './routes';
import { useAuthStore } from '@/features/auth/store/authStore';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to={routes.login} />;
};

export default PrivateRoute;

