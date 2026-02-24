import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
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
import type { get200AdminProjectsResponseJson, getAdminProjectsQueryParams } from '@/share/utils/api/__generated__/types';
import { PROJECTS_LIST } from '@/share/constants';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { formatDateToJalali, isDateLikeField } from '@/share/utils/jalaliDate';

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
  const [detail, setDetail] = useState<any | null>(null);
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

  const detailLabels: Record<string, string> = {
    id: 'شناسه',
    name: 'نام پروژه',
    title: 'عنوان',
    token_name: 'نام توکن',
    symbol: 'نماد توکن',
    price: 'قیمت',
    status: 'وضعیت',
    type: 'نوع پروژه',
    category: 'دسته‌بندی',
    options: 'امکانات پروژه',
    description: 'توضیحات',
    summary: 'خلاصه',
    contractor: 'پیمانکار',
    price_currency: 'واحد قیمت',
    token_count: 'تعداد توکن',
    token_sold: 'توکن فروخته‌شده',
    sale_price_per_meter: 'قیمت فروش هر متر ملک',
    token_price_toman: 'قیمت هر توکن (تومان)',
    price_per_meter_token: 'قیمت هر متر به توکن',
    estimated_profit_percentage: 'درصد سود پیش‌بینی‌شده',
    contract_address: 'آدرس قرارداد',
    owner_wallet: 'کیف پول مالک',
    wallet_address: 'آدرس کیف پول',
    address: 'آدرس',
    project_address: 'آدرس پروژه',
    location: 'مختصات (lat lng)',
    project_location: 'لوکیشن پروژه',
    city: 'شهر',
    province: 'استان',
    state: 'ایالت',
    country: 'کشور',
    postal_code: 'کد پستی',
    district: 'منطقه',
    latitude: 'عرض جغرافیایی',
    longitude: 'طول جغرافیایی',
    lat: 'عرض جغرافیایی',
    lng: 'طول جغرافیایی',
    dead_line: 'ددلاین (شمسی)',
    deadline: 'ددلاین (شمسی)',
    start_time: 'تاریخ شروع (شمسی)',
    start_date: 'تاریخ شروع',
    end_date: 'تاریخ پایان',
    due_date: 'تاریخ سررسید',
    created_at: 'تاریخ ایجاد',
    updated_at: 'آخرین بروزرسانی',
    published_at: 'تاریخ انتشار'
  };

  const projectOptionLabels: Record<string, string> = {
    warehouse: 'انباری',
    heating_system: 'سیستم گرمایشی',
    cooling_system: 'سیستم سرمایشی',
    elevator: 'آسانسور',
    no_elevator_required: 'عدم نیاز به آسانسور'
  };

  const getDetailLabel = (key: string) => detailLabels[key] ?? `فیلد ${key.replace(/_/g, ' ')}`;

  const formatDetailValue = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return '—';

    if (key === 'status' && typeof value === 'string') {
      return <StatusChip status={value as 'processing' | 'finished'} />;
    }

    if (Array.isArray(value)) {
      if (!value.length) return '—';

      return (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          {value.map((item, index) => (
            <Chip key={`${String(item)}-${index}`} label={typeof item === 'object' ? JSON.stringify(item) : key === 'options' ? (projectOptionLabels[String(item)] ?? String(item)) : String(item)} size="small" variant="outlined" />
          ))}
        </Stack>
      );
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value as Record<string, unknown>);
      return (
        <Stack spacing={0.75}>
          {entries.map(([childKey, childValue]) => (
            <Typography key={childKey} variant="body2" color="text.secondary">
              {getDetailLabel(childKey)}: {childValue === null || childValue === undefined || childValue === '' ? '—' : String(childValue)}
            </Typography>
          ))}
        </Stack>
      );
    }

    if (typeof value === 'string' && isDateLikeField(key)) {
      return formatDateToJalali(value, value);
    }

    return String(value);
  };

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
            setDetail((res.data as any)?.project ?? null);
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
        subtitle="مدیریت پروژه‌ها"
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

      <Dialog open={!!detail} onClose={() => setDetail(null)} fullWidth maxWidth="md">
        <DialogTitle sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 2 }}>
          <Stack spacing={0.75}>
            <Typography variant="h6" fontWeight={700}>جزئیات پروژه</Typography>
            <Typography variant="body2" sx={{ color: "primary.contrastText", opacity: 0.9 }}>نمایش اطلاعات کامل پروژه به‌صورت دسته‌بندی‌شده</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box px={2.5} py={1.5} bgcolor="primary.50">
              <Typography variant="subtitle2" fontWeight={700} color="primary.main">اطلاعات پایه</Typography>
            </Box>
            <Divider />
            <Grid container spacing={2} p={2.5}>
              {detail
                ? Object.entries(detail).map(([key, value]) => (
                    <Grid key={key} item xs={12} sm={6}>
                      <Stack spacing={0.75}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>
                          {getDetailLabel(key)}
                        </Typography>
                        <Typography variant="body2" component="div">
                          {formatDetailValue(key, value)}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))
                : null}
            </Grid>
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};
