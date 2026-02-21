import { Chip } from '@mui/material';

const colors: Record<string, 'success' | 'warning' | 'error' | 'default' | 'info'> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  success: 'success',
  failed: 'error',
  processing: 'warning',
  finished: 'success',
  completed: 'success',
  rejected: 'error'
};

const labels: Record<string, string> = {
  active: 'فعال',
  inactive: 'غیرفعال',
  pending: 'در انتظار',
  success: 'موفق',
  failed: 'ناموفق',
  processing: 'در حال پردازش',
  finished: 'تکمیل‌شده',
  completed: 'تکمیل‌شده',
  rejected: 'ردشده'
};

export const StatusChip = ({ status }: { status: string }) => <Chip size="small" label={labels[status] ?? status} color={colors[status] ?? 'info'} />;
