import { Navigate } from 'react-router-dom';
import { storage } from '@/shared/lib/storage';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for authenticated routes
 */
export function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = storage.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

