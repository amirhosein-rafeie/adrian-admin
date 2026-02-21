import { MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mockApi } from '@/services/mockApi';
import { db } from '@/services/mockDb';
import { queryClient } from '@/services/queryClient';
import { OrderStatus } from '@/types/models';
import { QUERY_KEYS } from '@/share/constants';

export const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { notify } = useSnackbar();
  const { data = [], isLoading } = useQuery({ queryKey: QUERY_KEYS.orders, queryFn: () => mockApi.getAll(db.orders) });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => mockApi.update(db.orders, id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders });
      notify('وضعیت سفارش به‌روزرسانی شد');
    }
  });

  const filtered = useMemo(() => data.filter((o) => (statusFilter === 'all' ? true : o.status === statusFilter)), [data, statusFilter]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'شناسه', width: 70 },
    { field: 'user', headerName: 'کاربر', width: 130 },
    { field: 'projectId', headerName: 'پروژه', flex: 1, valueGetter: (v) => db.projects.find((p) => p.id === v)?.title ?? '-' },
    { field: 'quantity', headerName: 'تعداد', width: 80 },
    { field: 'total_price', headerName: 'جمع کل', width: 100 },
    {
      field: 'status',
      headerName: 'وضعیت',
      width: 180,
      renderCell: (p) => (
        <TextField select size="small" value={p.value} onChange={(e) => updateMutation.mutate({ id: p.row.id, status: e.target.value as OrderStatus })}>
          <MenuItem value="processing">در حال پردازش</MenuItem>
          <MenuItem value="completed">تکمیل‌شده</MenuItem>
          <MenuItem value="rejected">ردشده</MenuItem>
        </TextField>
      )
    },
    { field: 'statusChip', headerName: 'نشان', width: 120, renderCell: (p) => <StatusChip status={p.row.status} />, sortable: false },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 120 }
  ];

  return (
    <>
      <PageHeader title="سفارش‌ها" subtitle="فیلتر و تغییر سریع وضعیت سفارش‌ها" />
      <Stack mb={2} direction="row" spacing={2}>
        <TextField select label="فیلتر بر اساس وضعیت" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 220 }}>
          <MenuItem value="all">همه</MenuItem><MenuItem value="processing">در حال پردازش</MenuItem><MenuItem value="completed">تکمیل‌شده</MenuItem><MenuItem value="rejected">ردشده</MenuItem>
        </TextField>
      </Stack>
      <DataTable rows={filtered} columns={columns} loading={isLoading} />
    </>
  );
};
