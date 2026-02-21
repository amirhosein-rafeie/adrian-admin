import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { PROJECTS_LIST, TOKENS_LIST } from '@/share/constants';
import {
  get200AdminProjectsResponseJson,
  get200AdminTokensResponseJson,
  getAdminTokensQueryParams,
  patchAdminTokensIdRequestBodyJson,
  postAdminTokensRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

const schema = z.object({
  token_name: z.string().min(2, 'حداقل ۲ کاراکتر وارد کنید'),
  project_id: z.coerce.number().min(1, 'انتخاب پروژه الزامی است'),
  abbreviation: z.string().min(2, 'نماد توکن الزامی است'),
  price_per_token: z.coerce.number().positive('عدد باید بزرگ‌تر از صفر باشد')
});
type FormValues = z.infer<typeof schema>;

type TokenRow = NonNullable<get200AdminTokensResponseJson['tokens']>[number];

export const TokensPage = () => {
  const [selected, setSelected] = useState<TokenRow | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const { notify } = useSnackbar();

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { token_name: '', project_id: 1, abbreviation: '', price_per_token: 1 } });

  const query = useMemo<getAdminTokensQueryParams>(
    () => ({
      project_id: projectFilter === 'all' ? undefined : Number(projectFilter),
      search: search || undefined,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [projectFilter, search, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [TOKENS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/tokens', { params: { query } })
  });

  const { data: projectsData } = useQuery({
    queryKey: [PROJECTS_LIST, 'token-filter'],
    queryFn: () => clientRequest.GET('/admin/projects', { params: { query: { limit: 200, offset: 0 } } })
  });

  const projects = ((projectsData?.data as get200AdminProjectsResponseJson | undefined)?.projects ?? []).map((item) => item.project);

  const mutateRefresh = () => queryClient.invalidateQueries({ queryKey: [TOKENS_LIST] });
  const createMutation = useMutation({
    mutationFn: (v: postAdminTokensRequestBodyJson) => clientRequest.POST('/admin/tokens', { body: v }),
    onSuccess: () => {
      mutateRefresh();
      notify('توکن ایجاد شد');
    }
  });
  const updateMutation = useMutation({
    mutationFn: (v: patchAdminTokensIdRequestBodyJson) => clientRequest.PATCH('/admin/tokens/{id}', { params: { path: { id: selected!.id } }, body: v }),
    onSuccess: () => {
      mutateRefresh();
      notify('توکن ویرایش شد');
    }
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientRequest.DELETE('/admin/tokens/{id}', { params: { path: { id } } }),
    onSuccess: () => {
      mutateRefresh();
      notify('توکن حذف شد');
    }
  });

  const responseData = data?.data as get200AdminTokensResponseJson | undefined;
  const rows = responseData?.tokens ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<TokenRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 80 },
    { field: 'token_name', headerName: 'نام توکن', flex: 1 },
    { field: 'project_id', headerName: 'شناسه پروژه', width: 120 },
    { field: 'abbreviation', headerName: 'نماد', width: 100 },
    { field: 'price_per_token', headerName: 'قیمت', width: 120 },
    { field: 'total_supply', headerName: 'کل عرضه', width: 110 },
    { field: 'sold', headerName: 'فروخته شده', width: 110 },
    { field: 'remaining', headerName: 'باقی‌مانده', width: 110 },
    { field: 'created_at', headerName: 'تاریخ ایجاد', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 160,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row">
          <Button size="small" onClick={() => { setSelected(p.row); form.reset({ token_name: p.row.token_name, project_id: p.row.project_id, abbreviation: p.row.abbreviation, price_per_token: p.row.price_per_token }); }}>ویرایش</Button>
          <Button size="small" color="error" onClick={() => setConfirmId(p.row.id)}>حذف</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader title="توکن‌ها" subtitle="مدیریت توکن‌ها با API ادمین + فیلتر، جستجو و صفحه‌بندی" action={<Button variant="contained" onClick={() => { setSelected({} as TokenRow); form.reset({ token_name: '', project_id: projects[0]?.id ?? 1, abbreviation: '', price_per_token: 1 }); }}>ایجاد توکن</Button>} />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو (نام/نماد)" value={search} onChange={(e) => { setSearch(e.target.value); setPaginationModel((p) => ({ ...p, page: 0 })); }} />
        <TextField select label="فیلتر بر اساس پروژه" value={projectFilter} onChange={(e) => { setProjectFilter(e.target.value); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: 260 }}>
          <MenuItem value="all">همه پروژه‌ها</MenuItem>
          {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
        </TextField>
      </Stack>
      <DataTable rows={rows} columns={columns} loading={isLoading} paginationMode="server" rowCount={total} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} />
      <FormModal open={!!selected} title={selected?.id ? 'ویرایش توکن' : 'ایجاد توکن'} onClose={() => setSelected(null)} onSubmit={form.handleSubmit(async (v) => { selected?.id ? await updateMutation.mutateAsync(v) : await createMutation.mutateAsync(v); setSelected(null); })}>
        <Stack spacing={2} mt={1}>
          <TextField label="نام توکن" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} />
          <TextField select label="پروژه" {...form.register('project_id')}>
            {projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
          </TextField>
          <TextField label="نماد" {...form.register('abbreviation')} error={!!form.formState.errors.abbreviation} helperText={form.formState.errors.abbreviation?.message} />
          <TextField type="number" label="قیمت هر توکن" {...form.register('price_per_token')} error={!!form.formState.errors.price_per_token} helperText={form.formState.errors.price_per_token?.message} />
        </Stack>
      </FormModal>
      <ConfirmDialog open={confirmId !== null} title="حذف توکن" description="این توکن حذف شود؟" onClose={() => setConfirmId(null)} onConfirm={async () => { await deleteMutation.mutateAsync(confirmId!); setConfirmId(null); }} />
    </>
  );
};
