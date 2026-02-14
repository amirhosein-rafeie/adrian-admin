import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Box, Skeleton } from '@mui/material';
import { EmptyState } from './EmptyState';

export const DataTable = ({ rows, columns, loading }: { rows: GridRowsProp; columns: GridColDef[]; loading?: boolean }) => {
  if (loading) {
    return (
      <Box>
        <Skeleton height={60} />
        <Skeleton height={320} />
      </Box>
    );
  }

  if (!rows.length) return <EmptyState title="No data found" />;

  return (
    <Box sx={{ height: 480, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5, 10, 20]} initialState={{ pagination: { paginationModel: { pageSize: 10 } } }} />
    </Box>
  );
};
