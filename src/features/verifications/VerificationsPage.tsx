import { Button, Chip, Divider, Drawer, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material';
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
import { resolveApiFileUrl } from '@/share/utils/fileUrl';

type VerificationRow = NonNullable<get200AdminVerificationsResponseJson['verifications']>[number];

const verificationTypeLabel: Record<string, string> = {
  id_card_photo: 'کارت ملی',
  id_card_video: 'ویدیو'
};

const renderDocumentPreview = (fileUrl: string, verificationType?: string) => {
  if (!fileUrl) return <Typography color="text.secondary">فایل مدرک موجود نیست.</Typography>;

  if (verificationType === 'id_card_video' || /\.(mp4|webm|mov|mkv)$/i.test(fileUrl)) {
    return <Stack component="video" src={fileUrl} controls sx={{ width: '100%', maxHeight: 360, borderRadius: 1, backgroundColor: 'black' }} />;
  }

  if (/\.(pdf)$/i.test(fileUrl)) {
    return <Stack component="iframe" src={fileUrl} sx={{ width: '100%', height: 420, border: 0, borderRadius: 1 }} />;
  }

  return <Stack component="img" src={fileUrl} alt="مدرک احراز هویت" sx={{ width: '100%', maxHeight: 420, objectFit: 'contain', borderRadius: 1 }} />;
};

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
    { field: 'verification_type', headerName: 'نوع مدرک', width: 150, valueGetter: (_, row) => verificationTypeLabel[row.verification_type ?? ''] ?? row.verification_type ?? '-' },
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

  const drawerFileUrl = resolveApiFileUrl(drawer?.file_path);

  return (
    <>
      <PageHeader title="احراز هویت کاربران" subtitle="مشاهده مدارک، پیش‌نمایش، تایید/رد با دلیل" />
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
        <Stack p={2.5} spacing={2} width={{ xs: 380, md: 560 }}>
          <Typography variant="h6">جزئیات و پیش‌نمایش مدرک</Typography>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" mb={1.5}>
              <Chip label={`شناسه: ${drawer?.id ?? '-'}`} />
              <Chip label={`کاربر: ${drawer?.user_id ?? '-'}`} />
              <Chip label={`نوع: ${verificationTypeLabel[drawer?.verification_type ?? ''] ?? drawer?.verification_type ?? '-'}`} />
              <Chip label={`وضعیت: ${drawer?.status ?? '-'}`} color={drawer?.status === 'verified' ? 'success' : drawer?.status === 'failed' ? 'error' : 'default'} />
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            <Typography variant="body2" color="text.secondary">دلیل رد: {drawer?.failure_reason ?? '-'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>لینک فایل: {drawerFileUrl || '-'}</Typography>
            {drawerFileUrl ? <Button href={drawerFileUrl} target="_blank" rel="noreferrer" variant="outlined" size="small" sx={{ mt: 1 }}>بازکردن در تب جدید</Button> : null}
          </Paper>

          <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
            {renderDocumentPreview(drawerFileUrl, drawer?.verification_type ?? undefined)}
          </Paper>
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
