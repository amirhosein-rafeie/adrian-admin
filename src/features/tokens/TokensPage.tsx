import { zodResolver } from '@hookform/resolvers/zod';
import { Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { DataTable } from '@/components/DataTable';
import { FormModal } from '@/components/FormModal';
import { PageHeader } from '@/components/PageHeader';
import { StatusChip } from '@/components/StatusChip';
import { useSnackbar } from '@/hooks/useSnackbar';
import { mockApi } from '@/services/mockApi';
import { db } from '@/services/mockDb';
import { queryClient } from '@/services/queryClient';
import { Token } from '@/types/models';

const schema = z.object({
  token_name: z.string().min(2),
  projectId: z.coerce.number().min(1),
  amount: z.coerce.number().positive(),
  price_per_token: z.coerce.number().positive(),
  status: z.enum(['active', 'inactive'])
});
type FormValues = z.infer<typeof schema>;

export const TokensPage = () => {
  const [selected, setSelected] = useState<Token | null>(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { notify } = useSnackbar();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { token_name: '', projectId: 1, amount: 1, price_per_token: 1, status: 'active' } });

  const { data = [], isLoading } = useQuery({ queryKey: ['tokens'], queryFn: () => mockApi.getAll(db.tokens) });

  const filtered = useMemo(
    () => data.filter((t) => (projectFilter === 'all' ? true : t.projectId === Number(projectFilter))),
    [data, projectFilter]
  );

  const mutateRefresh = () => queryClient.invalidateQueries({ queryKey: ['tokens'] });
  const createMutation = useMutation({ mutationFn: (v: FormValues) => mockApi.create(db.tokens, { ...v, created_at: new Date().toISOString().slice(0, 10) }), onSuccess: () => { mutateRefresh(); notify('Token created'); } });
  const updateMutation = useMutation({ mutationFn: (v: FormValues) => mockApi.update(db.tokens, selected!.id, v), onSuccess: () => { mutateRefresh(); notify('Token updated'); } });
  const deleteMutation = useMutation({ mutationFn: (id: number) => mockApi.delete(db.tokens, id), onSuccess: () => { mutateRefresh(); notify('Token deleted'); } });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'token_name', headerName: 'Token Name', flex: 1 },
    { field: 'projectId', headerName: 'Project', flex: 1, valueGetter: (v) => db.projects.find((p) => p.id === v)?.title ?? '-' },
    { field: 'amount', headerName: 'Amount', width: 110 },
    { field: 'price_per_token', headerName: 'Price', width: 110 },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p) => <StatusChip status={p.value} /> },
    { field: 'created_at', headerName: 'Created At', width: 130 },
    { field: 'actions', headerName: 'Actions', width: 160, sortable: false, renderCell: (p) => <Stack direction="row"><Button size="small" onClick={() => { setSelected(p.row); form.reset(p.row); }}>Edit</Button><Button size="small" color="error" onClick={() => setConfirmId(p.row.id)}>Delete</Button></Stack> }
  ];

  return (
    <>
      <PageHeader title="Tokens" subtitle="Manage project tokens" action={<Button variant="contained" onClick={() => { setSelected({} as Token); form.reset({ token_name: '', projectId: db.projects[0]?.id ?? 1, amount: 1, price_per_token: 1, status: 'active' }); }}>Create Token</Button>} />
      <TextField select label="Filter by project" value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} sx={{ mb: 2, width: 260 }}>
        <MenuItem value="all">All projects</MenuItem>
        {db.projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)}
      </TextField>
      <DataTable rows={filtered} columns={columns} loading={isLoading} />
      <FormModal open={!!selected} title={selected?.id ? 'Edit Token' : 'Create Token'} onClose={() => setSelected(null)} onSubmit={form.handleSubmit(async (v) => { selected?.id ? await updateMutation.mutateAsync(v) : await createMutation.mutateAsync(v); setSelected(null); })}>
        <Stack spacing={2} mt={1}>
          <TextField label="Token name" {...form.register('token_name')} error={!!form.formState.errors.token_name} helperText={form.formState.errors.token_name?.message} />
          <TextField select label="Project" {...form.register('projectId')}>
            {db.projects.map((p) => <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>)}
          </TextField>
          <TextField type="number" label="Amount" {...form.register('amount')} />
          <TextField type="number" label="Price per token" {...form.register('price_per_token')} />
          <TextField select label="Status" {...form.register('status')}><MenuItem value="active">Active</MenuItem><MenuItem value="inactive">Inactive</MenuItem></TextField>
        </Stack>
      </FormModal>
      <ConfirmDialog open={confirmId !== null} title="Delete Token" description="Delete this token?" onClose={() => setConfirmId(null)} onConfirm={async () => { await deleteMutation.mutateAsync(confirmId!); setConfirmId(null); }} />
    </>
  );
};
