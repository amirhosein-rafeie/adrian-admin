import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MenuItem, Select, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StatusChip } from '../../components/StatusChip';
import { useAppContext } from '../../hooks/useAppContext';
import { orderService } from '../../services';
import { OrderStatus } from '../../services/types';

export const OrdersPage = () => {
  const { notify } = useAppContext();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('all');
  const { data = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: orderService.getAll });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => orderService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      notify('Order status updated');
    }
  });

  const rows = useMemo(() => data.filter((item) => statusFilter === 'all' || item.status === statusFilter), [data, statusFilter]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'user', headerName: 'User', flex: 1 },
    { field: 'project', headerName: 'Project', flex: 1 },
    { field: 'quantity', headerName: 'Qty', width: 80 },
    { field: 'total_price', headerName: 'Total', width: 100 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <StatusChip status={params.value as string} /> },
    {
      field: 'updateStatus',
      headerName: 'Update',
      width: 150,
      renderCell: (params) => (
        <Select size="small" value={params.row.status} onChange={(event) => mutation.mutate({ id: params.row.id, status: event.target.value as OrderStatus })}>
          <MenuItem value="processing">processing</MenuItem>
          <MenuItem value="completed">completed</MenuItem>
          <MenuItem value="rejected">rejected</MenuItem>
        </Select>
      )
    },
    { field: 'created_at', headerName: 'Created', width: 120 }
  ];

  return (
    <>
      <PageHeader title="Orders" subtitle="Manage order fulfillment" />
      <Stack direction={{ xs: 'column', md: 'row' }} mb={2}>
        <TextField select value={statusFilter} label="Status" size="small" onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 200 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="processing">processing</MenuItem>
          <MenuItem value="completed">completed</MenuItem>
          <MenuItem value="rejected">rejected</MenuItem>
        </TextField>
      </Stack>
      <DataTable rows={rows} columns={columns} loading={isLoading} />
    </>
  );
};
