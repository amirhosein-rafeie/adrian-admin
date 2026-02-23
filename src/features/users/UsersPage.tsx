import { Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { USERS_LIST } from '@/share/constants';
import type {
  get200AdminUsersResponseJson,
  getAdminUsersQueryParams,
  putAdminUsersIdRequestBodyJson
} from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';

type UserRow = NonNullable<get200AdminUsersResponseJson['users']>[number];
type UserStatus = NonNullable<UserRow['status']>;

export const UsersPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<UserRow | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<putAdminUsersIdRequestBodyJson>({});
  const { notify } = useSnackbar();

  const query = useMemo<getAdminUsersQueryParams>(
    () => ({
      search: search || undefined,
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: paginationModel.pageSize,
      offset: paginationModel.page * paginationModel.pageSize
    }),
    [search, statusFilter, paginationModel]
  );

  const { data, isLoading } = useQuery({
    queryKey: [USERS_LIST, query],
    queryFn: () => clientRequest.GET('/admin/users', { params: { query } })
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: putAdminUsersIdRequestBodyJson }) =>
      clientRequest.PUT('/admin/users/{id}', { params: { path: { id } }, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_LIST] });
      notify('کاربر ویرایش شد');
      setSelected(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientRequest.DELETE('/admin/users/{id}', { params: { path: { id } } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_LIST] });
      notify('کاربر حذف شد');
      setConfirmId(null);
    }
  });

  const responseData = data?.data as get200AdminUsersResponseJson | undefined;
  const rows = responseData?.users ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<UserRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'mobile_number', headerName: 'موبایل', width: 150 },
    { field: 'first_name', headerName: 'نام', width: 120, valueGetter: (_, row) => row.first_name ?? '-' },
    { field: 'last_name', headerName: 'نام خانوادگی', width: 140, valueGetter: (_, row) => row.last_name ?? '-' },
    { field: 'national_code', headerName: 'کد ملی', width: 130, valueGetter: (_, row) => row.national_code ?? '-' },
    { field: 'status', headerName: 'وضعیت', width: 130, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'created_at', headerName: 'ایجاد', width: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      width: 210,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            onClick={async () => {
              const res = await clientRequest.GET('/admin/users/{id}', { params: { path: { id: p.row.id! } } });
              const user = res.data as UserRow | undefined;
              if (!user) return;
              setSelected(user);
              setEditForm({
                first_name: user.first_name ?? '',
                last_name: user.last_name ?? '',
                national_code: user.national_code ?? '',
                status: user.status ?? null
              });
            }}
          >
            مشاهده/ادیت
          </Button>
          <Button size="small" color="error" onClick={() => setConfirmId(p.row.id!)}>حذف</Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader title="کاربران" subtitle="مشاهده، ویرایش و حذف کاربران" />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو" value={search} onChange={(e) => { setSearch(e.target.value); setPaginationModel((prev) => ({ ...prev, page: 0 })); }} />
        <TextField select label="وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((prev) => ({ ...prev, page: 0 })); }} sx={{ width: 220 }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="no_info">بدون اطلاعات</MenuItem>
          <MenuItem value="no_password">بدون رمز</MenuItem>
          <MenuItem value="active">فعال</MenuItem>
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

      <FormModal
        open={!!selected}
        title={selected ? `ویرایش کاربر #${selected.id}` : 'ویرایش کاربر'}
        onClose={() => setSelected(null)}
        onSubmit={async () => {
          if (!selected?.id) return;
          await updateMutation.mutateAsync({ id: selected.id, body: editForm });
        }}
      >
        <Stack spacing={2} mt={1}>
          <Typography variant="body2">موبایل: {selected?.mobile_number ?? '-'}</Typography>
          <TextField label="نام" value={editForm.first_name ?? ''} onChange={(e) => setEditForm((prev) => ({ ...prev, first_name: e.target.value }))} />
          <TextField label="نام خانوادگی" value={editForm.last_name ?? ''} onChange={(e) => setEditForm((prev) => ({ ...prev, last_name: e.target.value }))} />
          <TextField label="کد ملی" value={editForm.national_code ?? ''} onChange={(e) => setEditForm((prev) => ({ ...prev, national_code: e.target.value }))} />
          <TextField select label="وضعیت" value={editForm.status ?? ''} onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as UserStatus }))}>
            <MenuItem value="no_info">بدون اطلاعات</MenuItem>
            <MenuItem value="no_password">بدون رمز</MenuItem>
            <MenuItem value="active">فعال</MenuItem>
          </TextField>
        </Stack>
      </FormModal>

      <ConfirmDialog
        open={confirmId !== null}
        title="حذف کاربر"
        description="آیا از حذف این کاربر مطمئن هستید؟"
        onClose={() => setConfirmId(null)}
        onConfirm={async () => {
          if (!confirmId) return;
          await deleteMutation.mutateAsync(confirmId);
        }}
      />
    </>
  );
};
