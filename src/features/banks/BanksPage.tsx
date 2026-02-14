import { Button, Stack } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mockApi } from '@/services/mockApi';
import { db } from '@/services/mockDb';
import { queryClient } from '@/services/queryClient';

export const BanksPage = () => {
  const { data = [], isLoading } = useQuery({ queryKey: ['banks'], queryFn: () => mockApi.getAll(db.banks) });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { notify } = useSnackbar();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mockApi.delete(db.banks, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      notify('Bank account deleted');
    }
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'bank_name', headerName: 'Bank', width: 130 },
    { field: 'account_number', headerName: 'Account Number', width: 160 },
    { field: 'iban', headerName: 'IBAN', flex: 1 },
    { field: 'owner_name', headerName: 'Owner', width: 150 },
    { field: 'created_at', headerName: 'Created', width: 120 },
    { field: 'actions', headerName: 'Actions', width: 100, renderCell: (p) => <Stack><Button color="error" size="small" onClick={() => setConfirmId(p.row.id)}>Delete</Button></Stack> }
  ];

  return (
    <>
      <PageHeader title="Bank Accounts" subtitle="Read-only list with delete option" />
      <DataTable rows={data} columns={columns} loading={isLoading} />
      <ConfirmDialog open={confirmId !== null} title="Delete bank account" description="Are you sure?" onClose={() => setConfirmId(null)} onConfirm={async () => { await deleteMutation.mutateAsync(confirmId!); setConfirmId(null); }} />
    </>
  );
};
