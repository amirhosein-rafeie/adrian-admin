import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
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
import type { get200AdminVerificationsResponseJson, getAdminVerificationsQueryParams } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { toJalaliDateTime } from '@/share/utils/date';

type VerificationRow = NonNullable<get200AdminVerificationsResponseJson['verifications']>[number];

export const VerificationsPage = () => {
  const { notify } = useSnackbar();
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'failed'>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [selected, setSelected] = useState<VerificationRow | null>(null);
  const [rejecting, setRejecting] = useState<VerificationRow | null>(null);
  const [failureReason, setFailureReason] = useState('');

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
      queryClient.invalidateQueries({ queryKey: [VERIFICATIONS_LIST] });
      notify('احراز هویت تایید شد');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      clientRequest.POST('/admin/verifications/{id}/reject', { params: { path: { id } }, body: { failure_reason: reason } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VERIFICATIONS_LIST] });
      notify('احراز هویت رد شد');
    }
  });

  const responseData = data?.data as get200AdminVerificationsResponseJson | undefined;
  const rows = responseData?.verifications ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<VerificationRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'user_id', headerName: 'شناسه کاربر', minWidth: 120 },
    { field: 'verification_type', headerName: 'نوع مدرک', minWidth: 150, flex: 1 },
    { field: 'file_path', headerName: 'مدرک', minWidth: 220, flex: 1, renderCell: (p) => <a href={p.value} target="_blank" rel="noreferrer">نمایش فایل</a> },
    { field: 'status', headerName: 'وضعیت', minWidth: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'failure_reason', headerName: 'دلیل رد', minWidth: 180, flex: 1, valueGetter: (_v, row) => row.failure_reason ?? '-' },
    { field: 'created_at', headerName: 'تاریخ', minWidth: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 250,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setSelected(p.row)}>جزئیات</Button>
          <Button size="small" color="success" onClick={() => approveMutation.mutate(p.row.id!)} disabled={p.row.status === 'verified'}>تایید</Button>
          <Button size="small" color="error" onClick={() => setRejecting(p.row)} disabled={p.row.status === 'failed'}>رد</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader title="احراز هویت کاربران" subtitle="مشاهده مدارک و تایید/رد احراز هویت با دلیل" />
      <Stack mb={2}>
        <TextField select label="وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: 220 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="pending">در انتظار</MenuItem>
          <MenuItem value="verified">تایید شده</MenuItem>
          <MenuItem value="failed">رد شده</MenuItem>
        </TextField>
      </Stack>
      <DataTable rows={rows} columns={columns} loading={isLoading} paginationMode="server" rowCount={total} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />

      <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth>
        <DialogTitle>جزئیات احراز هویت</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} mt={1}>
            {selected ? Object.entries(selected).map(([key, value]) => (
              <Typography key={key}><strong>{key}:</strong> {key.includes('at') ? toJalaliDateTime(String(value ?? '')) : (value ? String(value) : '-')}</Typography>
            )) : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>بستن</Button>
        </DialogActions>
      </Dialog>

      <FormModal
        open={!!rejecting}
        title="رد احراز هویت"
        onClose={() => { setRejecting(null); setFailureReason(''); }}
        onSubmit={async () => {
          if (!rejecting?.id || !failureReason.trim()) return;
          await rejectMutation.mutateAsync({ id: rejecting.id, reason: failureReason });
          setRejecting(null);
          setFailureReason('');
        }}
      >
        <TextField label="دلیل رد" value={failureReason} onChange={(e) => setFailureReason(e.target.value)} multiline minRows={3} fullWidth required sx={{ mt: 1 }} />
      </FormModal>
    </>
  );
};
