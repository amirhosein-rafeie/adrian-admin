import { Navigate, useLocation } from 'react-router-dom';
import { auth } from '@/services/auth';

export const RoleGuard = ({ children }: { children: React.ReactElement }) => {
  const location = useLocation();

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
