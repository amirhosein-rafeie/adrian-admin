import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Drawer, MenuItem, Select, Stack, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { StatusChip } from '../../components/StatusChip';
import { useAppContext } from '../../hooks/useAppContext';
import { transactionService } from '../../services';
import { TransactionStatus } from '../../services/types';

export const TransactionsPage = () => {
  const { notify } = useAppContext();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: transactionService.getAll });

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TransactionStatus }) => transactionService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      notify('Transaction status updated');
    }
  });

  const selected = data.find((item) => item.id === selectedId);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'user', headerName: 'User', flex: 1 },
    { field: 'token', headerName: 'Token', flex: 1 },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <StatusChip status={params.value as string} /> },
    {
      field: 'changeStatus',
      headerName: 'Update',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Select
          size="small"
          value={params.row.status}
          onChange={(event) => mutation.mutate({ id: params.row.id, status: event.target.value as TransactionStatus })}>
          <MenuItem value="pending">pending</MenuItem>
          <MenuItem value="success">success</MenuItem>
          <MenuItem value="failed">failed</MenuItem>
        </Select>
      )
    },
    {
      field: 'details',
      headerName: 'Details',
      width: 100,
      renderCell: (params) => (
        <Typography sx={{ cursor: 'pointer' }} color="primary" onClick={() => setSelectedId(params.row.id)}>
          View
        </Typography>
      )
    },
    { field: 'created_at', headerName: 'Created', width: 120 }
  ];

  return (
    <>
      <PageHeader title="Transactions" subtitle="Monitor and update transaction status" />
      <DataTable rows={data} columns={columns} loading={isLoading} />
      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelectedId(null)}>
        <Box p={3} width={320}>
          <Typography variant="h6" mb={2}>
            Transaction Details
          </Typography>
          {selected ? (
            <Stack spacing={1}>
              <Typography>ID: {selected.id}</Typography>
              <Typography>User: {selected.user}</Typography>
              <Typography>Token: {selected.token}</Typography>
              <Typography>Amount: {selected.amount}</Typography>
              <Typography>Date: {selected.created_at}</Typography>
            </Stack>
          ) : null}
        </Box>
      </Drawer>
    </>
  );
};
