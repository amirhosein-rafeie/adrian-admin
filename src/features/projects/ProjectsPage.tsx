import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, Link, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import type { components } from '@/share/utils/api/__generated__/custom';
import type { get200AdminProjectsResponseJson, get200AdminProjectsIdResponseJson, getAdminProjectsQueryParams } from '@/share/utils/api/__generated__/types';
import { PROJECTS_LIST } from '@/share/constants';
import { gregorianToJalali } from '@/share/utils/jalaliDate';
import { clientRequest } from '@/share/utils/api/clientRequest';

type ProjectRow = {
  id: number;
  name: string;
  description: string;
  status: 'processing' | 'finished';
  created_at: string;
  token_name: string;
  price: string;
};

export const ProjectsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'processing' | 'finished'>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [detail, setDetail] = useState<get200AdminProjectsIdResponseJson | null>(null);
  const navigate = useNavigate();
  const { notify } = useSnackbar();

  const query = useMemo<getAdminProjectsQueryParams>(
    () => ({
      search: search || undefined,
      status: status === 'all' ? undefined : status,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [search, status, paginationModel]
  );

  const { data, isPending, isError } = useQuery({
    queryKey: [PROJECTS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/projects', { params: { query } })
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientRequest.DELETE('/admin/projects/{id}', { params: { path: { id } } }),
    onSuccess: () => {
      notify('پروژه حذف شد');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_LIST] });
      setConfirmId(null);
    }
  });

  const responseData = data?.data as get200AdminProjectsResponseJson | undefined;
  const mappedRows: ProjectRow[] =
    (responseData?.projects ?? []).map(({ project }) => ({
      id: project.id,
      name: project.name,
      description: project.description ?? '-',
      status: project.status,
      created_at: project.created_at ?? '-',
      token_name: project.token_name ?? '-',
      price: project.price ?? '-'
    }));

  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<ProjectRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 80 },
    { field: 'name', headerName: 'عنوان پروژه', flex: 1 },
    { field: 'token_name', headerName: 'نام توکن', flex: 1 },
    { field: 'price', headerName: 'قیمت', width: 140 },
    { field: 'description', headerName: 'توضیحات', flex: 1.2 },
    { field: 'status', headerName: 'وضعیت', width: 140, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 260,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={async () => {
            const res = await clientRequest.GET('/admin/projects/{id}', { params: { path: { id: p.row.id } } });
            setDetail((res.data as get200AdminProjectsIdResponseJson) ?? null);
          }}>مشاهده</Button>
          <Button size="small" onClick={() => navigate(`/projects/${p.row.id}/edit`)}>ویرایش</Button>
          <Button size="small" color="error" onClick={() => setConfirmId(p.row.id)}>حذف</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        subtitle="CRUD پروژه‌ها"
        action={<Button variant="contained" onClick={() => navigate('/projects/create')}>ایجاد پروژه</Button>}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو" value={search} onChange={(e) => { setSearch(e.target.value); setPaginationModel((p) => ({ ...p, page: 0 })); }} />
        <TextField select label="وضعیت" value={status} onChange={(e) => { setStatus(e.target.value as typeof status); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: 200 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="processing">در حال پردازش</MenuItem>
          <MenuItem value="finished">تکمیل‌شده</MenuItem>
        </TextField>
      </Stack>
      {isError ? (
        <EmptyState />
      ) : (
        <DataTable rows={mappedRows} columns={columns} loading={isPending} paginationMode="server" rowCount={total} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
      )}

      <ConfirmDialog open={confirmId !== null} title="حذف پروژه" description="آیا از حذف پروژه مطمئن هستید؟" onClose={() => setConfirmId(null)} onConfirm={async () => { if (!confirmId) return; await deleteMutation.mutateAsync(confirmId); }} />

      <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="sm">
        <DialogTitle>جزئیات پروژه</DialogTitle>
        <DialogContent>
          {detail ? <ProjectDetailsContent detail={detail} /> : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetail(null)}>بستن</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const optionLabels: Record<string, string> = {
  warehouse: 'انباری',
  heating_system: 'سیستم گرمایش',
  cooling_system: 'سیستم سرمایش',
  elevator: 'آسانسور',
  no_elevator_required: 'بدون نیاز به آسانسور'
};

const mediaTypeLabels: Record<components['schemas']['ProjectMedia']['media_type'], string> = {
  img: 'تصویر',
  pdf: 'PDF',
  video: 'ویدئو'
};

const DetailItem = ({ label, value }: { label: string; value?: string | number | null }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value ?? '-'}</Typography>
  </Box>
);

const ProjectDetailsContent = ({ detail }: { detail: get200AdminProjectsIdResponseJson }) => {
  const project = detail.project;

  return (
    <Stack spacing={2} mt={1}>
      <Stack spacing={0.5}>
        <Typography variant="h6">{project.name}</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <StatusChip status={project.status} />
          <Typography variant="caption" color="text.secondary">شناسه: {project.id}</Typography>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><DetailItem label="نام توکن" value={project.token_name} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="قیمت" value={project.price} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="واحد قیمت" value={project.price_currency} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="پیمانکار" value={project.contractor} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="تعداد توکن" value={project.token_count} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="توکن فروخته‌شده" value={project.token_sold} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="تاریخ شروع" value={gregorianToJalali(project.start_time)} /></Grid>
        <Grid item xs={12} sm={6}><DetailItem label="ددلاین" value={gregorianToJalali(project.dead_line)} /></Grid>
      </Grid>

      <Divider />

      <DetailItem label="موقعیت" value={project.location} />
      <DetailItem label="آدرس" value={project.address} />
      <DetailItem label="توضیحات" value={project.description} />

      <Box>
        <Typography variant="caption" color="text.secondary">امکانات</Typography>
        <Stack direction="row" spacing={1} mt={0.5} flexWrap="wrap" useFlexGap>
          {project.options?.length ? project.options.map((option) => <Chip key={option} size="small" label={optionLabels[option] ?? option} />) : <Typography variant="body2">-</Typography>}
        </Stack>
      </Box>

      <Divider />

      <Box>
        <Typography variant="subtitle2" gutterBottom>مدیا</Typography>
        <Stack spacing={1}>
          {detail.media.length ? detail.media.map((media) => (
            <Stack key={media.id} direction="row" justifyContent="space-between" alignItems="center" sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 1 }}>
              <Stack>
                <Typography variant="body2">{media.name}</Typography>
                <Typography variant="caption" color="text.secondary">{mediaTypeLabels[media.media_type]} • {gregorianToJalali(media.created_at)}</Typography>
              </Stack>
              <Link href={media.path} target="_blank" rel="noreferrer" underline="hover">مشاهده فایل</Link>
            </Stack>
          )) : <Typography variant="body2">فایلی ثبت نشده است.</Typography>}
        </Stack>
      </Box>
    </Stack>
  );
};
