import { Alert } from '@mui/material';

export const RoleGuard = ({ children }: { children: React.ReactNode }) => {
  const hasAccess = true;
  if (!hasAccess) return <Alert severity="error">Unauthorized</Alert>;
  return <>{children}</>;
};
