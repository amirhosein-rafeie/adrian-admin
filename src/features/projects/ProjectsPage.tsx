import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/DataTable';
import { EmptyState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import type { get200AdminProjectsResponseJson, getAdminProjectsQueryParams } from '@/share/utils/api/__generated__/types';
import { PROJECTS_LIST } from '@/share/constants';
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
  const navigate = useNavigate();

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
      width: 140,
      sortable: false,
      renderCell: (p) => <Button size="small" onClick={() => navigate(`/projects/${p.row.id}/edit`)}>ویرایش</Button>
    }
  ];

  return (
    <>
      <PageHeader
        title="پروژه‌ها"
        subtitle="دریافت لیست، جستجو و صفحه‌بندی سمت سرور"
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
    </>
  );
};
