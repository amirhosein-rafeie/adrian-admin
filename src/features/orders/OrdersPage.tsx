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

export const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState('all');
  const { notify } = useSnackbar();
  const { data = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: () => mockApi.getAll(db.orders) });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => mockApi.update(db.orders, id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notify('Order status updated');
    }
  });

  const filtered = useMemo(() => data.filter((o) => (statusFilter === 'all' ? true : o.status === statusFilter)), [data, statusFilter]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'user', headerName: 'User', width: 130 },
    { field: 'projectId', headerName: 'Project', flex: 1, valueGetter: (v) => db.projects.find((p) => p.id === v)?.title ?? '-' },
    { field: 'quantity', headerName: 'Qty', width: 80 },
    { field: 'total_price', headerName: 'Total', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (p) => (
        <TextField select size="small" value={p.value} onChange={(e) => updateMutation.mutate({ id: p.row.id, status: e.target.value as OrderStatus })}>
          <MenuItem value="processing">processing</MenuItem>
          <MenuItem value="completed">completed</MenuItem>
          <MenuItem value="rejected">rejected</MenuItem>
        </TextField>
      )
    },
    { field: 'statusChip', headerName: 'Badge', width: 120, renderCell: (p) => <StatusChip status={p.row.status} />, sortable: false },
    { field: 'created_at', headerName: 'Created', width: 120 }
  ];

  return (
    <>
      <PageHeader title="Orders" subtitle="Inline status updates and filtering" />
      <Stack mb={2} direction="row" spacing={2}>
        <TextField select label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ width: 220 }}>
          <MenuItem value="all">All</MenuItem><MenuItem value="processing">Processing</MenuItem><MenuItem value="completed">Completed</MenuItem><MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Stack>
      <DataTable rows={filtered} columns={columns} loading={isLoading} />
    </>
  );
};
