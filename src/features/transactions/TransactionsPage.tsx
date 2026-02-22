import { Drawer, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { TRANSACTIONS_LIST } from '@/share/constants';
import {
  get200AdminTransactionsResponseJson,
  getAdminTransactionsQueryParams,
  patchAdminTransactionsIdStatusRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { toJalaliDateTime } from '@/share/utils/date';

type TransactionRow = NonNullable<get200AdminTransactionsResponseJson['transactions']>[number];

export const TransactionsPage = () => {
  const [drawer, setDrawer] = useState<TransactionRow | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { notify } = useSnackbar();

  const query = useMemo<getAdminTransactionsQueryParams>(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [statusFilter, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [TRANSACTIONS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/transactions', { params: { query } })
  });

  useEffect(() => {
    const timer = window.setTimeout(() => window.dispatchEvent(new Event('resize')), 0);
    return () => window.clearTimeout(timer);
  }, [drawer]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: patchAdminTransactionsIdStatusRequestBodyJson['status'] }) =>
      clientRequest.PATCH('/admin/transactions/{id}/status', {
        params: { path: { id } },
        body: { status }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TRANSACTIONS_LIST] });
      notify('وضعیت با موفقیت به‌روزرسانی شد');
    }
  });

  const responseData = data?.data as get200AdminTransactionsResponseJson | undefined;
  const rows = responseData?.transactions ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<TransactionRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'user_id', headerName: 'شناسه کاربر', width: 120 },
    { field: 'provider', headerName: 'درگاه', width: 120 },
    { field: 'type', headerName: 'نوع', width: 120 },
    { field: 'amount', headerName: 'مبلغ', width: 120 },
    {
      field: 'status',
      headerName: 'وضعیت',
      width: 180,
      renderCell: (p) => (
        <TextField select size="small" value={p.value} onChange={(e) => statusMutation.mutate({ id: p.row.id, status: e.target.value as patchAdminTransactionsIdStatusRequestBodyJson['status'] })}>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="success">موفق</MenuItem>
          <MenuItem value="failed">ناموفق</MenuItem>
        </TextField>
      )
    },
    { field: 'statusChip', headerName: 'نشان', width: 120, sortable: false, renderCell: (p) => <StatusChip status={p.row.status} /> },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 140, valueGetter: (_v, row) => toJalaliDateTime(row.created_at) }
  ];

  return (
    <>
      <PageHeader title="تراکنش‌ها" subtitle="نمایش اطلاعات، فیلتر و صفحه‌بندی سمت سرور" />
      <Stack mb={2}>
        <TextField select label="فیلتر وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: 220 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="success">موفق</MenuItem>
          <MenuItem value="failed">ناموفق</MenuItem>
        </TextField>
      </Stack>
      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        onRowClick={(params) => setDrawer(params.row as TransactionRow)}
        paginationMode="server"
        rowCount={total}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <Drawer anchor="right" open={!!drawer} onClose={() => setDrawer(null)} ModalProps={{ disableScrollLock: true }}>
        <Stack p={3} spacing={2} width={360}>
          <Typography variant="h6">جزئیات تراکنش</Typography>
          {drawer ? (
            <Stack spacing={1.5}>
              <Typography><strong>شناسه:</strong> {drawer.id ?? '-'}</Typography>
              <Typography><strong>شناسه کاربر:</strong> {drawer.user_id ?? '-'}</Typography>
              <Typography><strong>درگاه:</strong> {drawer.provider ?? '-'}</Typography>
              <Typography><strong>نوع:</strong> {drawer.type ?? '-'}</Typography>
              <Typography><strong>مبلغ:</strong> {drawer.amount ?? '-'}</Typography>
              <Typography><strong>وضعیت:</strong> {drawer.status ?? '-'}</Typography>
              <Typography><strong>تاریخ ایجاد:</strong> {toJalaliDateTime(drawer.created_at)}</Typography>
            </Stack>
          ) : null}
        </Stack>
      </Drawer>
    </>
  );
};
