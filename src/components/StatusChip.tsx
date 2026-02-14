import { Chip } from '@mui/material';

const statusColor: Record<string, 'default' | 'success' | 'error' | 'warning' | 'info'> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  success: 'success',
  failed: 'error',
  processing: 'info',
  completed: 'success',
  rejected: 'error'
};

export const StatusChip = ({ status }: { status: string }) => <Chip label={status} color={statusColor[status] ?? 'default'} size="small" />;
