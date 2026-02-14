import { Chip } from '@mui/material';

const colors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  success: 'success',
  failed: 'error',
  processing: 'warning',
  completed: 'success',
  rejected: 'error'
};

export const StatusChip = ({ status }: { status: string }) => <Chip size="small" label={status} color={colors[status] ?? 'info'} />;
