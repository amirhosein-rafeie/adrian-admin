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
  rejected: 'error',
  verified: 'success',
  no_info: 'warning',
  no_password: 'info'
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
  rejected: 'ردشده',
  verified: 'تایید شده',
  no_info: 'بدون اطلاعات',
  no_password: 'بدون رمز'
};

export const StatusChip = ({ status }: { status: string }) => <Chip size="small" label={labels[status] ?? status} color={colors[status] ?? 'info'} />;
