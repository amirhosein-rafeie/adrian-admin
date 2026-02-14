import { Drawer, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mockApi } from '@/services/mockApi';
import { db } from '@/services/mockDb';
import { queryClient } from '@/services/queryClient';
import { Transaction, TransactionStatus } from '@/types/models';

export const TransactionsPage = () => {
  const { data = [], isLoading } = useQuery({ queryKey: ['transactions'], queryFn: () => mockApi.getAll(db.transactions) });
  const [drawer, setDrawer] = useState<Transaction | null>(null);
  const { notify } = useSnackbar();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: TransactionStatus }) => mockApi.update(db.transactions, id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      notify('Status updated');
    }
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'user', headerName: 'User', flex: 1 },
    { field: 'tokenId', headerName: 'Token', flex: 1, valueGetter: (v) => db.tokens.find((t) => t.id === v)?.token_name ?? '-' },
    { field: 'amount', headerName: 'Amount', width: 120 },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (p) => (
        <TextField
          select
          size="small"
          value={p.value}
          onChange={(e) => statusMutation.mutate({ id: p.row.id, status: e.target.value as TransactionStatus })}
        >
          <MenuItem value="pending">pending</MenuItem>
          <MenuItem value="success">success</MenuItem>
          <MenuItem value="failed">failed</MenuItem>
        </TextField>
      )
    },
    { field: 'statusLabel', headerName: 'Badge', width: 120, renderCell: (p) => <StatusChip status={p.row.status} />, sortable: false },
    { field: 'created_at', headerName: 'Created', width: 120 }
  ];

  return (
    <>
      <PageHeader title="Transactions" subtitle="Read-only with inline status update and detail drawer" />
      <DataTable rows={data} columns={columns} loading={isLoading} onRowClick={(params) => setDrawer(params.row)} />
      <Drawer anchor="right" open={!!drawer} onClose={() => setDrawer(null)}>
        <Stack p={3} spacing={2} width={320}>
          <Typography variant="h6">Transaction Details</Typography>
          {drawer ? Object.entries(drawer).map(([k, v]) => <Typography key={k}><strong>{k}:</strong> {String(v)}</Typography>) : null}
        </Stack>
      </Drawer>
    </>
  );
};
