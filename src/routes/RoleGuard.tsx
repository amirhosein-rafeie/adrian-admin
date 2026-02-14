import { Navigate } from 'react-router-dom';

export const RoleGuard = ({ children, allowed = true }: { children: React.ReactElement; allowed?: boolean }) => {
  if (!allowed) return <Navigate to="/" replace />;
  return children;
};
