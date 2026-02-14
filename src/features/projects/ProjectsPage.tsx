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
import { projectService } from '../../services';
import { Project } from '../../services/types';

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(3),
  status: z.enum(['active', 'inactive'])
});

type FormValues = z.infer<typeof schema>;

export const ProjectsPage = () => {
  const { notify } = useAppContext();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const { data = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: projectService.getAll });

  const createMutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('Project created');
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Project> }) => projectService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('Project updated');
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: projectService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      notify('Project deleted');
      setDeletingId(null);
    }
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', status: 'active' }
  });

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    reset({ title: '', description: '', status: 'active' });
  };

  const onSubmit = (values: FormValues) => {
    if (editing) updateMutation.mutate({ id: editing.id, payload: values });
    else createMutation.mutate({ ...values, created_at: new Date().toISOString().slice(0, 10) });
  };

  const filtered = useMemo(
    () =>
      data.filter(
        (project) =>
          project.title.toLowerCase().includes(search.toLowerCase()) && (statusFilter === 'all' || project.status === statusFilter)
      ),
    [data, search, statusFilter]
  );

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1.2 },
    { field: 'status', headerName: 'Status', width: 130, renderCell: (params) => <StatusChip status={params.value as string} /> },
    { field: 'created_at', headerName: 'Created At', width: 120 },
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
              reset({ title: params.row.title, description: params.row.description, status: params.row.status });
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
        title="Projects"
        subtitle="Manage project entities"
        action={
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditing(null);
              setIsOpen(true);
            }}>
            Create Project
          </Button>
        }
      />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects" size="small" />
        <TextField select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ minWidth: 180 }}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </TextField>
      </Stack>
      <DataTable rows={filtered} columns={columns} loading={isLoading} />

      <FormModal open={isOpen} title={editing ? 'Edit Project' : 'Create Project'} onClose={closeModal}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} display="grid" gap={2} mt={1}>
          <Controller name="title" control={control} render={({ field }) => <TextField {...field} label="Title" />} />
          <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="Description" />} />
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
        title="Delete Project"
        description="Are you sure you want to delete this project?"
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteMutation.mutate(deletingId)}
      />
    </>
  );
};
