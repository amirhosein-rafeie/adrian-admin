import { DataGrid, DataGridProps, faIR } from '@mui/x-data-grid';
import { Box, Skeleton } from '@mui/material';

export const DataTable = (props: DataGridProps) => (
  <Box sx={{ height: 520, width: '100%' }}>
    {props.loading ? (
      <Skeleton variant="rounded" height={520} />
    ) : (
      <DataGrid
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        localeText={faIR.components.MuiDataGrid.defaultProps.localeText}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        {...props}
      />
    )}
  </Box>
);
