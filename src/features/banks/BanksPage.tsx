import { Delete } from '@mui/icons-material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DataTable } from '../../components/DataTable';
import { PageHeader } from '../../components/PageHeader';
import { useAppContext } from '../../hooks/useAppContext';
import { bankService } from '../../services';

export const BanksPage = () => {
  const { notify } = useAppContext();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { data = [], isLoading } = useQuery({ queryKey: ['banks'], queryFn: bankService.getAll });

  const deleteMutation = useMutation({
    mutationFn: bankService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banks'] });
      notify('Bank account deleted');
      setDeletingId(null);
    }
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'bank_name', headerName: 'Bank', flex: 1 },
    { field: 'account_number', headerName: 'Account Number', flex: 1 },
    { field: 'iban', headerName: 'IBAN', flex: 1.3 },
    { field: 'owner_name', headerName: 'Owner', flex: 1 },
    { field: 'created_at', headerName: 'Created', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Button color="error" onClick={() => setDeletingId(params.row.id)}>
          <Delete fontSize="small" />
        </Button>
      )
    }
  ];

  return (
    <>
      <PageHeader title="Bank Accounts" subtitle="Read-only list with delete option" />
      <DataTable rows={data} columns={columns} loading={isLoading} />
      <ConfirmDialog
        open={deletingId !== null}
        title="Delete Bank Account"
        description="Delete this bank account permanently?"
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </>
  );
};
