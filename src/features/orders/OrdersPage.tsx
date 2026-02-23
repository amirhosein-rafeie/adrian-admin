import { Chip, Drawer, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { DetailKeyValueList } from '@/components/DetailKeyValueList';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { ORDERS_LIST } from '@/share/constants';
import {
  get200AdminOrdersResponseJson,
  getAdminOrdersQueryParams,
  patchAdminOrdersIdStatusRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

type OrderRow = NonNullable<get200AdminOrdersResponseJson['orders']>[number];

export const OrdersPage = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  const [drawer, setDrawer] = useState<any | null>(null);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { notify } = useSnackbar();

  const query = useMemo<getAdminOrdersQueryParams>(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [statusFilter, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [ORDERS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/orders', { params: { query } })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: patchAdminOrdersIdStatusRequestBodyJson['status'] }) =>
      clientRequest.PATCH('/admin/orders/{id}/status', {
        params: { path: { id } },
        body: { status }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_LIST] });
      notify('وضعیت سفارش به‌روزرسانی شد');
    }
  });

  const responseData = data?.data as get200AdminOrdersResponseJson | undefined;
  const rows = responseData?.orders ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<OrderRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'user_id', headerName: 'شناسه کاربر', width: 120 },
    { field: 'token_id', headerName: 'شناسه توکن', width: 120 },
    { field: 'token_amount', headerName: 'تعداد توکن', width: 120 },
    { field: 'amount_paid', headerName: 'مبلغ پرداختی', width: 130 },
    {
      field: 'status',
      headerName: 'وضعیت',
      width: 180,
      renderCell: (p) => (
        <TextField
          select
          size="small"
          value={p.value}
          onChange={(e) => updateMutation.mutate({ id: p.row.id, status: e.target.value as patchAdminOrdersIdStatusRequestBodyJson['status'] })}
        >
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="verified">تایید شده</MenuItem>
          <MenuItem value="failed">ناموفق</MenuItem>
        </TextField>
      )
    },
    { field: 'status_chip', headerName: 'نشان', width: 110, sortable: false, renderCell: (p) => <StatusChip status={p.row.status} /> },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 110,
      sortable: false,
      renderCell: (p) => <TextField select size="small" value="actions" onChange={async (e) => {
        if (e.target.value !== 'view') return;
        const res = await clientRequest.GET('/admin/orders/{id}', { params: { path: { id: p.row.id } } });
        setDrawer(res.data);
      }}>
        <MenuItem value="actions" disabled>عملیات</MenuItem>
        <MenuItem value="view">مشاهده</MenuItem>
      </TextField>
    },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 140 }
  ];

  return (
    <>
      <PageHeader title="سفارش‌ها" subtitle="فیلتر، صفحه‌بندی و تغییر وضعیت سفارش‌ها" />
      <Stack mb={2} direction="row" spacing={2}>
        <TextField select label="فیلتر بر اساس وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: 240 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="verified">تایید شده</MenuItem>
          <MenuItem value="failed">ناموفق</MenuItem>
        </TextField>
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
      <Drawer anchor="right" open={!!drawer} onClose={() => setDrawer(null)} ModalProps={{ disableScrollLock: true }}>
        <Stack p={2.5} spacing={2} width={{ xs: 360, md: 520 }}>
          <Typography variant="h6">جزئیات سفارش</Typography>
          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip label={`شناسه سفارش: ${drawer?.id ?? '-'}`} />
              <Chip label={`کاربر: ${drawer?.user_id ?? '-'}`} />
              <Chip label={`وضعیت: ${drawer?.status ?? '-'}`} color={drawer?.status === 'verified' ? 'success' : drawer?.status === 'failed' ? 'error' : 'default'} />
            </Stack>
          </Paper>
          <DetailKeyValueList data={drawer} />
        </Stack>
      </Drawer>
    </>
  );
};
