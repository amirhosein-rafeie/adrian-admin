import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { useSnackbar } from '@/hooks/useSnackbar';
import { queryClient } from '@/services/queryClient';
import { USERS_LIST } from '@/share/constants';
import type { get200AdminUsersResponseJson, getAdminUsersQueryParams, putAdminUsersIdRequestBodyJson } from '@/share/utils/api/__generated__/types';
import { clientRequest } from '@/share/utils/api/clientRequest';
import { toJalaliDateTime } from '@/share/utils/date';

type UserRow = NonNullable<get200AdminUsersResponseJson['users']>[number];

const getStatusLabel = (status: UserRow['status']) => {
  if (status === 'active') return 'فعال';
  if (status === 'no_password') return 'بدون رمز';
  return 'بدون اطلاعات';
};

const getStatusColor = (status: UserRow['status']) => {
  if (status === 'active') return 'success';
  if (status === 'no_password') return 'warning';
  return 'default';
};

export const UsersPage = () => {
  const { notify } = useSnackbar();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'no_info' | 'no_password' | 'active'>('all');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ page: 0, pageSize: 10 });
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [editableUser, setEditableUser] = useState<UserRow | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

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
      notify('کاربر با موفقیت ویرایش شد');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientRequest.DELETE('/admin/users/{id}', { params: { path: { id } } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USERS_LIST] });
      notify('کاربر حذف شد');
    }
  });

  const responseData = data?.data as get200AdminUsersResponseJson | undefined;
  const rows = responseData?.users ?? [];
  const total = responseData?.meta?.total ?? 0;

  const columns: GridColDef<UserRow>[] = [
    { field: 'id', headerName: 'شناسه', width: 90 },
    { field: 'mobile_number', headerName: 'شماره موبایل', minWidth: 150, flex: 1 },
    { field: 'first_name', headerName: 'نام', minWidth: 120, flex: 1, valueGetter: (_v, row) => row.first_name ?? '-' },
    { field: 'last_name', headerName: 'نام خانوادگی', minWidth: 140, flex: 1, valueGetter: (_v, row) => row.last_name ?? '-' },
    { field: 'national_code', headerName: 'کد ملی', minWidth: 130, flex: 1, valueGetter: (_v, row) => row.national_code ?? '-' },
    { field: 'status', headerName: 'وضعیت', minWidth: 130, valueGetter: (_v, row) => getStatusLabel(row.status) },
    { field: 'created_at', headerName: 'تاریخ ایجاد', minWidth: 130 },
    {
      field: 'actions',
      headerName: 'عملیات',
      minWidth: 220,
      sortable: false,
      renderCell: (p) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" onClick={() => setSelectedUser(p.row)}>مشاهده</Button>
          <Button size="small" onClick={() => setEditableUser(p.row)}>ویرایش</Button>
          <Button size="small" color="error" onClick={() => setConfirmDeleteId(p.row.id!)}>حذف</Button>
        </Stack>
      )
    }
  ];

  const detailRows = selectedUser
    ? [
        { label: 'شناسه کاربر', value: selectedUser.id },
        { label: 'شماره موبایل', value: selectedUser.mobile_number },
        { label: 'نام', value: selectedUser.first_name || '-' },
        { label: 'نام خانوادگی', value: selectedUser.last_name || '-' },
        { label: 'کد ملی', value: selectedUser.national_code || '-' },
        { label: 'تاریخ تولد', value: toJalaliDateTime(selectedUser.birth_date) },
        { label: 'تاریخ ایجاد', value: toJalaliDateTime(selectedUser.created_at) },
        { label: 'آخرین بروزرسانی', value: toJalaliDateTime(selectedUser.updated_at) }
      ]
    : [];

  return (
    <>
      <PageHeader title="کاربران" subtitle="مشاهده، ویرایش و حذف کاربران" />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
        <TextField label="جستجو" value={search} onChange={(e) => { setSearch(e.target.value); setPaginationModel((p) => ({ ...p, page: 0 })); }} />
        <TextField select label="وضعیت" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPaginationModel((p) => ({ ...p, page: 0 })); }} sx={{ width: { xs: '100%', sm: 220 } }}>
          <MenuItem value="all">همه</MenuItem>
          <MenuItem value="active">فعال</MenuItem>
          <MenuItem value="no_password">بدون رمز</MenuItem>
          <MenuItem value="no_info">بدون اطلاعات</MenuItem>
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

      <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="md">
        <DialogTitle>جزئیات کاربر</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <Stack spacing={2} mt={1}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight={700}>
                  {`${selectedUser.first_name || '-'} ${selectedUser.last_name || ''}`.trim()}
                </Typography>
                <Chip label={getStatusLabel(selectedUser.status)} color={getStatusColor(selectedUser.status)} size="small" />
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                {detailRows.map((item) => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="body2" fontWeight={500}>{item.value ? String(item.value) : '-'}</Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)}>بستن</Button>
        </DialogActions>
      </Dialog>

      <FormModal
        open={!!editableUser}
        title="ویرایش کاربر"
        onClose={() => setEditableUser(null)}
        onSubmit={async () => {
          if (!editableUser?.id) return;
          await updateMutation.mutateAsync({
            id: editableUser.id,
            body: {
              first_name: editableUser.first_name ?? null,
              last_name: editableUser.last_name ?? null,
              national_code: editableUser.national_code ?? null,
              birth_date: editableUser.birth_date ?? null,
              status: editableUser.status ?? null
            }
          });
          setEditableUser(null);
        }}
      >
        <Stack spacing={2} mt={1}>
          <TextField label="نام" value={editableUser?.first_name ?? ''} onChange={(e) => setEditableUser((p) => (p ? { ...p, first_name: e.target.value } : p))} />
          <TextField label="نام خانوادگی" value={editableUser?.last_name ?? ''} onChange={(e) => setEditableUser((p) => (p ? { ...p, last_name: e.target.value } : p))} />
          <TextField label="کد ملی" value={editableUser?.national_code ?? ''} onChange={(e) => setEditableUser((p) => (p ? { ...p, national_code: e.target.value } : p))} />
          <TextField
            select
            label="وضعیت"
            value={editableUser?.status ?? 'no_info'}
            onChange={(e) => setEditableUser((p) => (p ? { ...p, status: e.target.value as UserRow['status'] } : p))}
          >
            <MenuItem value="active">فعال</MenuItem>
            <MenuItem value="no_password">بدون رمز</MenuItem>
            <MenuItem value="no_info">بدون اطلاعات</MenuItem>
          </TextField>
        </Stack>
      </FormModal>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="حذف کاربر"
        description="از حذف این کاربر مطمئن هستید؟"
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={async () => {
          if (confirmDeleteId) await deleteMutation.mutateAsync(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </>
  );
};
