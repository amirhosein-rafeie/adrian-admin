import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DataTable } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { projectsApi } from '@/services/projectsApi';
import { queryClient } from '@/services/queryClient';
import type { postAdminProjectsRequestBodyJson } from '@/share/utils/api/__generated__/types';
import { QUERY_KEYS } from '@/share/constants';

const schema = z.object({
  name: z.string().min(2, 'حداقل ۲ کاراکتر وارد کنید'),
  description: z.string().optional(),
  status: z.enum(['processing', 'finished']),
  address: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'),
  location: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'),
  price: z.string().min(1, 'قیمت الزامی است'),
  price_currency: z.string().min(1, 'واحد قیمت الزامی است'),
  token_count: z.coerce.number().min(1, 'تعداد توکن باید حداقل ۱ باشد'),
  token_name: z.string().min(2, 'نام توکن الزامی است'),
  start_time: z.string().min(1, 'تاریخ شروع الزامی است'),
  dead_line: z.string().min(1, 'ددلاین الزامی است'),
  contractor: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

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
  const [status, setStatus] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { notify } = useSnackbar();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'processing',
      address: '',
      location: '',
      price: '',
      price_currency: 'IRR',
      token_count: 1,
      token_name: '',
      start_time: '',
      dead_line: '',
      contractor: ''
    }
  });

  const { data = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: projectsApi.getProjects
  });

  const createMutation = useMutation({
    mutationFn: (values: postAdminProjectsRequestBodyJson) => projectsApi.createProject(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      notify('پروژه با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      notify(error.message, 'error');
    }
  });

  const mappedRows: ProjectRow[] = useMemo(
    () =>
      data.map(({ project }) => ({
        id: project.id,
        name: project.name,
        description: project.description ?? '-',
        status: project.status,
        created_at: project.created_at?.slice(0, 10) ?? '-',
        token_name: project.token_name ?? '-',
        price: project.price ?? '-'
      })),
    [data]
  );

  const filtered = useMemo(
    () => mappedRows.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || row.status === status)),
    [mappedRows, search, status]
  );

  const columns: GridColDef<ProjectRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 80 },
    { field: 'name', headerName: 'عنوان پروژه', flex: 1 },
    { field: 'token_name', headerName: 'نام توکن', flex: 1 },
    { field: 'price', headerName: 'قیمت', width: 140 },
    { field: 'description', headerName: 'توضیحات', flex: 1.2 },
    { field: 'status', headerName: 'وضعیت', width: 140, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 130 }
  ];

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        subtitle="دریافت لیست و ایجاد پروژه از طریق API"
        action={<Button variant="contained" onClick={() => { setIsCreateOpen(true); form.reset(); }}>ایجاد پروژه</Button>}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField select label="وضعیت" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 200 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="processing">در حال پردازش</MenuItem>
          <MenuItem value="finished">تکمیل‌شده</MenuItem>
        </TextField>
      </Stack>
      {filtered.length === 0 && !isLoading ? <EmptyState /> : <DataTable rows={filtered} columns={columns} loading={isLoading} />}
      <FormModal
        open={isCreateOpen}
        title="ایجاد پروژه"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={form.handleSubmit(async (values) => {
          await createMutation.mutateAsync(values);
          setIsCreateOpen(false);
        })}
      >
        <Stack spacing={2} mt={1}>
          <TextField label="نام پروژه" {...form.register('name')} error={!!form.formState.errors.name} helperText={form.formState.errors.name?.message} />
          <TextField label="توضیحات" {...form.register('description')} error={!!form.formState.errors.description} helperText={form.formState.errors.description?.message} multiline minRows={2} />
          <TextField select label="وضعیت" {...form.register('status')}>
            <MenuItem value="processing">در حال پردازش</MenuItem>
            <MenuItem value="finished">تکمیل‌شده</MenuItem>
          </TextField>
          <TextField label="آدرس" {...form.register('address')} error={!!form.formState.errors.address} helperText={form.formState.errors.address?.message} />
          <TextField label="مختصات (lat lng)" {...form.register('location')} error={!!form.formState.errors.location} helperText={form.formState.errors.location?.message} />
          <TextField label="قیمت" {...form.register('price')} error={!!form.formState.errors.price} helperText={form.formState.errors.price?.message} />
          <TextField label="واحد قیمت" {...form.register('price_currency')} error={!!form.formState.errors.price_currency} helperText={form.formState.errors.price_currency?.message} />
          <TextField type="number" label="تعداد توکن" {...form.register('token_count')} error={!!form.formState.errors.token_count} helperText={form.formState.errors.token_count?.message} />
          <TextField label="نام توکن" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} />
          <TextField type="date" label="تاریخ شروع" {...form.register('start_time')} error={!!form.formState.errors.start_time} helperText={form.formState.errors.start_time?.message} InputLabelProps={{ shrink: true }} />
          <TextField type="date" label="ددلاین" {...form.register('dead_line')} error={!!form.formState.errors.dead_line} helperText={form.formState.errors.dead_line?.message} InputLabelProps={{ shrink: true }} />
          <TextField label="پیمانکار" {...form.register('contractor')} error={!!form.formState.errors.contractor} helperText={form.formState.errors.contractor?.message} />
        </Stack>
      </FormModal>
    </>
  );
};
