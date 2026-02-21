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
import { BANKS_LIST } from '@/share/constants';

export const BanksPage = () => {
  const { data = [], isLoading } = useQuery({ queryKey: [BANKS_LIST], queryFn: () => mockApi.getAll(db.banks) });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { notify } = useSnackbar();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mockApi.delete(db.banks, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANKS_LIST] });
      notify('حساب بانکی حذف شد');
    }
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'شناسه', width: 70 },
    { field: 'bank_name', headerName: 'بانک', width: 130 },
    { field: 'account_number', headerName: 'شماره حساب', width: 160 },
    { field: 'iban', headerName: 'شماره شبا', flex: 1 },
    { field: 'owner_name', headerName: 'نام صاحب حساب', width: 150 },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 120 },
    { field: 'actions', headerName: 'عملیات', width: 100, renderCell: (p) => <Stack><Button color="error" size="small" onClick={() => setConfirmId(p.row.id)}>حذف</Button></Stack> }
  ];

  return (
    <>
      <PageHeader title="حساب‌های بانکی" subtitle="نمایش لیست حساب‌ها با امکان حذف" />
      <DataTable rows={data} columns={columns} loading={isLoading} />
      <ConfirmDialog open={confirmId !== null} title="حذف حساب بانکی" description="آیا مطمئن هستید؟" onClose={() => setConfirmId(null)} onConfirm={async () => { await deleteMutation.mutateAsync(confirmId!); setConfirmId(null); }} />
    </>
  );
};
