import { Add, Delete, Edit } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Button, MenuItem, Stack, TextField } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { DataTable } from '../../components/DataTable';
import { FormModal } from '../../components/FormModal';
import { PageHeader } from '../../components/PageHeader';
import { StatusChip } from '../../components/StatusChip';
import { useAppContext } from '../../hooks/useAppContext';
import { projectService, tokenService } from '../../services';
import { Token } from '../../services/types';

const schema = z.object({
  token_name: z.string().min(2),
  projectId: z.coerce.number().min(1),
  amount: z.coerce.number().positive(),
  price_per_token: z.coerce.number().positive(),
  status: z.enum(['active', 'inactive'])
});

type FormValues = z.infer<typeof schema>;

export const TokensPage = () => {
  const { notify } = useAppContext();
  const queryClient = useQueryClient();
  const [projectFilter, setProjectFilter] = useState('all');
  const [editing, setEditing] = useState<Token | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data: tokens = [], isLoading } = useQuery({ queryKey: ['tokens'], queryFn: tokenService.getAll });
  const { data: projects = [] } = useQuery({ queryKey: ['projects'], queryFn: projectService.getAll });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { token_name: '', projectId: 1, amount: 0, price_per_token: 0, status: 'active' }
  });

  const createMutation = useMutation({
    mutationFn: tokenService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      notify('Token created');
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Token> }) => tokenService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      notify('Token updated');
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: tokenService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      notify('Token deleted');
      setDeletingId(null);
    }
  });

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    reset({ token_name: '', projectId: 1, amount: 0, price_per_token: 0, status: 'active' });
  };

  const filtered = useMemo(
    () => tokens.filter((token) => projectFilter === 'all' || String(token.projectId) === projectFilter),
    [tokens, projectFilter]
  );

  const onSubmit = (values: FormValues) => {
    if (editing) updateMutation.mutate({ id: editing.id, payload: values });
    else createMutation.mutate({ ...values, created_at: new Date().toISOString().slice(0, 10) });
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'token_name', headerName: 'Token Name', flex: 1 },
    {
      field: 'projectId',
      headerName: 'Project',
      flex: 1,
      valueGetter: ({ value }) => projects.find((p) => p.id === value)?.title ?? '-'
    },
    { field: 'amount', headerName: 'Amount', width: 100 },
    { field: 'price_per_token', headerName: 'Price', width: 100 },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (params) => <StatusChip status={params.value as string} /> },
    { field: 'created_at', headerName: 'Created', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 130,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row">
          <Button
            size="small"
            onClick={() => {
              setEditing(params.row);
              setIsOpen(true);
              reset(params.row);
            }}>
            <Edit fontSize="small" />
          </Button>
          <Button size="small" color="error" onClick={() => setDeletingId(params.row.id)}>
            <Delete fontSize="small" />
          </Button>
        </Stack>
      )
    }
  ];

  return (
    <>
      <PageHeader
        title="Tokens"
        subtitle="Manage project tokens"
        action={
          <Button variant="contained" startIcon={<Add />} onClick={() => setIsOpen(true)}>
            Create Token
          </Button>
        }
      />
      <TextField
        select
        size="small"
        label="Filter by project"
        value={projectFilter}
        onChange={(e) => setProjectFilter(e.target.value)}
        sx={{ mb: 2, minWidth: 220 }}>
        <MenuItem value="all">All Projects</MenuItem>
        {projects.map((project) => (
          <MenuItem key={project.id} value={String(project.id)}>
            {project.title}
          </MenuItem>
        ))}
      </TextField>
      <DataTable rows={filtered} columns={columns} loading={isLoading} />

      <FormModal open={isOpen} title={editing ? 'Edit Token' : 'Create Token'} onClose={closeModal}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="grid" gap={2} mt={1}>
          <Controller name="token_name" control={control} render={({ field }) => <TextField {...field} label="Token Name" />} />
          <Controller
            name="projectId"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Project">
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller name="amount" control={control} render={({ field }) => <TextField {...field} type="number" label="Amount" />} />
          <Controller name="price_per_token" control={control} render={({ field }) => <TextField {...field} type="number" label="Price per token" />} />
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            )}
          />
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </FormModal>

      <ConfirmDialog
        open={deletingId !== null}
        title="Delete Token"
        description="Are you sure you want to delete this token?"
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </>
  );
};
