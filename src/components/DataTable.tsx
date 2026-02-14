import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { Box, Skeleton } from '@mui/material';

const faLocaleText = {
  noRowsLabel: 'داده‌ای موجود نیست',
  noResultsOverlayLabel: 'نتیجه‌ای یافت نشد',
  toolbarColumns: 'ستون‌ها',
  toolbarFilters: 'فیلترها',
  toolbarDensity: 'تراکم',
  toolbarExport: 'خروجی',
  footerRowSelected: (count: number) => `${count.toLocaleString('fa-IR')} سطر انتخاب شده`,
  footerTotalRows: 'تعداد کل سطرها:'
};

export const DataTable = (props: DataGridProps) => (
  <Box sx={{ height: 520, width: '100%' }}>
    {props.loading ? (
      <Skeleton variant="rounded" height={520} />
    ) : (
      <DataGrid
        disableRowSelectionOnClick
        pageSizeOptions={[5, 10, 20]}
        localeText={faLocaleText}
        initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        {...props}
      />
    )}
  </Box>
);
