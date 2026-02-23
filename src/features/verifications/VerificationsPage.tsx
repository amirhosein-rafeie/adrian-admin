import { Button, Drawer, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { VERIFICATIONS_LIST } from '@/share/constants';
import type {
  get200AdminVerificationsResponseJson,
  getAdminVerificationsQueryParams,
  postAdminVerificationsIdRejectRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

type VerificationRow = NonNullable<get200AdminVerificationsResponseJson['verifications']>[number];

export const VerificationsPage = () => {
  const [drawer, setDrawer] = useState<VerificationRow | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [reason, setReason] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { notify } = useSnackbar();

  const query = useMemo<getAdminVerificationsQueryParams>(
    () => ({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [statusFilter, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [VERIFICATIONS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/verifications', { params: { query } })
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => clientRequest.POST('/admin/verifications/{id}/approve', { params: { path: { id } } }),
    onSuccess: () => {
      notify('احراز هویت تایید شد');
      queryClient.invalidateQueries({ queryKey: [VERIFICATIONS_LIST] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: postAdminVerificationsIdRejectRequestBodyJson }) =>
      clientRequest.POST('/admin/verifications/{id}/reject', { params: { path: { id } }, body }),
    onSuccess: () => {
      notify('احراز هویت رد شد');
      setRejectId(null);
      setReason('');
      queryClient.invalidateQueries({ queryKey: [VERIFICATIONS_LIST] });
    }
  });

  const responseData = data?.data as get200AdminVerificationsResponseJson | undefined;
  const rows = responseData?.verifications ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<VerificationRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'user_id', headerName: 'شناسه کاربر', width: 120 },
    { field: 'verification_type', headerName: 'نوع', width: 150 },
    { field: 'status', headerName: 'وضعیت', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'failure_reason', headerName: 'دلیل رد', width: 180, valueGetter: (_, row) => row.failure_reason ?? '-' },
    { field: 'created_at', headerName: 'ایجاد', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 240,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setDrawer(p.row)}>مشاهده</Button>
          <Button size="small" color="success" onClick={() => approveMutation.mutate(p.row.id!)}>تایید</Button>
          <Button size="small" color="error" onClick={() => setRejectId(p.row.id!)}>رد</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader title="احراز هویت کاربران" subtitle="مشاهده مدارک و تایید/رد با دلیل" />
      <Stack mb={2}>
        <TextField select label="فیلتر وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((prev) => ({ ...prev, page: 0 })); }} sx={{ width: 220 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="verified">تایید شده</MenuItem>
          <MenuItem value="failed">رد شده</MenuItem>
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
        <Stack p={3} spacing={1.5} width={360}>
          <Typography variant="h6">جزئیات احراز هویت</Typography>
          <Typography>شناسه: {drawer?.id ?? '-'}</Typography>
          <Typography>کاربر: {drawer?.user_id ?? '-'}</Typography>
          <Typography>نوع: {drawer?.verification_type ?? '-'}</Typography>
          <Typography>وضعیت: {drawer?.status ?? '-'}</Typography>
          <Typography>دلیل رد: {drawer?.failure_reason ?? '-'}</Typography>
          <Typography>فایل: {drawer?.file_path ?? '-'}</Typography>
          {drawer?.file_path ? <Button href={drawer.file_path} target="_blank" rel="noreferrer" variant="outlined">مشاهده مدرک</Button> : null}
        </Stack>
      </Drawer>

      <FormModal
        open={rejectId !== null}
        title="رد احراز هویت"
        onClose={() => { setRejectId(null); setReason(''); }}
        onSubmit={async () => {
          if (!rejectId || !reason.trim()) return;
          await rejectMutation.mutateAsync({ id: rejectId, body: { failure_reason: reason.trim() } });
        }}
      >
        <Stack spacing={2} mt={1}>
          <TextField
            label="دلیل رد"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            minRows={3}
            helperText="ثبت دلیل برای اطلاع کاربر الزامی است"
          />
        </Stack>
      </FormModal>
    </>
  );
};
