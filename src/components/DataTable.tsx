import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { Box, Skeleton } from '@mui/material';
import { useMemo } from 'react';

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

export const DataTable = (props: DataGridProps) => {
  const columns = useMemo(
    () =>
      (props.columns ?? []).map((column) => {
        const col = column as GridColDef;
        if (!col.field.includes('created_at') || col.valueFormatter) return col;

        return {
          ...col,
          valueFormatter: (value: string) => {
            if (!value) return '-';
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return value;
            return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).format(date);
          }
        } as GridColDef;
      }),
    [props.columns]
  );

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <Box sx={{ minWidth: 0, width: 'max(100%, 960px)', height: 520 }}>
        {props.loading ? (
          <Skeleton variant="rounded" height={520} />
        ) : (
          <DataGrid
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            localeText={faLocaleText}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            {...props}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};
