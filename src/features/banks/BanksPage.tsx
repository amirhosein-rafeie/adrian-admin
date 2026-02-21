import { Button, Stack, TextField } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { BANKS_LIST } from '@/share/constants';
import { get200AdminBankAccountsResponseJson, getAdminBankAccountsQueryParams } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

type BankRow = NonNullable<get200AdminBankAccountsResponseJson['accounts']>[number];

export const BanksPage = () => {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { notify } = useSnackbar();

  const query = useMemo<getAdminBankAccountsQueryParams>(
    () => ({
      user_id: userIdFilter ? Number(userIdFilter) : undefined,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [userIdFilter, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [BANKS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/bank_accounts', { params: { query } })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientRequest.DELETE('/admin/bank_accounts/{id}', { params: { path: { id } } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANKS_LIST] });
      notify('حساب بانکی حذف شد');
    }
  });

  const responseData = data?.data as get200AdminBankAccountsResponseJson | undefined;
  const rows = responseData?.accounts ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<BankRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 80 },
    { field: 'user_id', headerName: 'شناسه کاربر', width: 120 },
    { field: 'bank_name', headerName: 'بانک', width: 170 },
    { field: 'sheba_number', headerName: 'شماره شبا', flex: 1 },
    { field: 'bank_code', headerName: 'کد بانک', width: 120 },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 130 },
    { field: 'actions', headerName: 'عملیات', width: 100, sortable: false, renderCell: (p) => <Stack><Button color="error" size="small" onClick={() => setConfirmId(p.row.id)}>حذف</Button></Stack> }
  ];

  return (
    <>
      <PageHeader title="حساب‌های بانکی" subtitle="فیلتر و صفحه‌بندی حساب‌ها با API ادمین" />
      <Stack mb={2}>
        <TextField
          label="فیلتر بر اساس شناسه کاربر"
          value={userIdFilter}
          onChange={(e) => {
            setUserIdFilter(e.target.value.replace(/\D+/g, ''));
            setPaginationModel((p) => ({ ...p, page: 0 }));
          }}
          sx={{ width: 240 }}
        />
      </Stack>
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <ConfirmDialog open={confirmId !== null} title="حذف حساب بانکی" description="آیا مطمئن هستید؟" onClose={() => setConfirmId(null)} onConfirm={async () => { await deleteMutation.mutateAsync(confirmId!); setConfirmId(null); }} />
    </>
  );
};
