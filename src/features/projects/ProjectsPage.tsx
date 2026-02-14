import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mockApi } from '@/services/mockApi';
import { db } from '@/services/mockDb';
import { queryClient } from '@/services/queryClient';
import { Project } from '@/types/models';

const schema = z.object({ title: z.string().min(2, 'حداقل ۲ کاراکتر وارد کنید'), description: z.string().min(3, 'حداقل ۳ کاراکتر وارد کنید'), status: z.enum(['active', 'inactive']) });
type FormValues = z.infer<typeof schema>;

export const ProjectsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selected, setSelected] = useState<Project | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { notify } = useSnackbar();

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { title: '', description: '', status: 'active' } });

  const { data = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => mockApi.getAll(db.projects) });

  const createMutation = useMutation({
    mutationFn: (values: FormValues) => mockApi.create(db.projects, { ...values, created_at: new Date().toISOString().slice(0, 10) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('پروژه با موفقیت ایجاد شد');
    }
  });

  const updateMutation = useMutation({
    mutationFn: (values: FormValues) => mockApi.update(db.projects, selected!.id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('پروژه با موفقیت ویرایش شد');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => mockApi.delete(db.projects, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('پروژه حذف شد');
    }
  });

  const filtered = useMemo(
    () => data.filter((row) => row.title.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || row.status === status)),
    [data, search, status]
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'شناسه', width: 80 },
    { field: 'title', headerName: 'عنوان', flex: 1 },
    { field: 'description', headerName: 'توضیحات', flex: 1.2 },
    { field: 'status', headerName: 'وضعیت', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 160,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => {
            setSelected(p.row);
            form.reset({ title: p.row.title, description: p.row.description, status: p.row.status });
          }}>ویرایش</Button>
          <Button size="small" color="error" onClick={() => setConfirmId(p.row.id)}>حذف</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        subtitle="مدیریت کامل پروژه‌ها"
        action={<Button variant="contained" onClick={() => { setSelected({} as Project); form.reset({ title: '', description: '', status: 'active' }); }}>ایجاد پروژه</Button>}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TextField select label="وضعیت" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 180 }}>
          <MenuItem value="all">همه</MenuItem><MenuItem value="active">فعال</MenuItem><MenuItem value="inactive">غیرفعال</MenuItem>
        </TextField>
      </Stack>
      {filtered.length === 0 && !isLoading ? <EmptyState /> : <DataTable rows={filtered} columns={columns} loading={isLoading} />}
      <FormModal
        open={!!selected}
        title={selected?.id ? 'ویرایش پروژه' : 'ایجاد پروژه'}
        onClose={() => setSelected(null)}
        onSubmit={form.handleSubmit(async (values) => {
          if (selected?.id) await updateMutation.mutateAsync(values);
          else await createMutation.mutateAsync(values);
          setSelected(null);
        })}
      >
        <Stack spacing={2} mt={1}>
          <TextField label="عنوان" {...form.register('title')} error={!!form.formState.errors.title} helperText={form.formState.errors.title?.message} />
          <TextField label="توضیحات" {...form.register('description')} error={!!form.formState.errors.description} helperText={form.formState.errors.description?.message} />
          <TextField select label="وضعیت" {...form.register('status')}>
            <MenuItem value="active">فعال</MenuItem><MenuItem value="inactive">غیرفعال</MenuItem>
          </TextField>
        </Stack>
      </FormModal>
      <ConfirmDialog
        open={confirmId !== null}
        title="حذف پروژه"
        description="آیا از حذف این پروژه مطمئن هستید؟"
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteMutation.mutateAsync(confirmId!);
          setConfirmId(null);
        }}
      />
    </>
  );
};
