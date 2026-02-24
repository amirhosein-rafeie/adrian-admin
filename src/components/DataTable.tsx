import { DataGrid, DataGridProps, GridColDef } from '@mui/x-data-grid';
import { Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { formatDateToJalali, isDateLikeField } from '@/share/utils/jalaliDate';

const faLocaleText = {
  noRowsLabel: 'داده‌ای موجود نیست',
  noResultsOverlayLabel: 'نتیجه‌ای یافت نشد',
  toolbarColumns: 'ستون‌ها',
  toolbarFilters: 'فیلترها',
  toolbarDensity: 'تراکم',
  toolbarExport: 'خروجی',
  toolbarFiltersLabel: 'نمایش فیلترها',
  toolbarFiltersTooltipHide: 'مخفی کردن فیلترها',
  toolbarFiltersTooltipShow: 'نمایش فیلترها',
  toolbarFiltersTooltipActive: (count: number) => `${count.toLocaleString('fa-IR')} فیلتر فعال`,
  columnsPanelTextFieldLabel: 'یافتن ستون',
  columnsPanelTextFieldPlaceholder: 'نام ستون',
  columnsPanelShowAllButton: 'نمایش همه',
  columnsPanelHideAllButton: 'مخفی کردن همه',
  filterPanelAddFilter: 'افزودن فیلتر',
  filterPanelDeleteIconLabel: 'حذف',
  filterPanelLinkOperator: 'اپراتور ترکیب',
  filterPanelOperators: 'اپراتورها',
  filterPanelOperatorAnd: 'و',
  filterPanelOperatorOr: 'یا',
  filterPanelColumns: 'ستون‌ها',
  filterPanelInputLabel: 'مقدار',
  filterPanelInputPlaceholder: 'مقدار فیلتر را وارد کنید',
  filterOperatorContains: 'شامل',
  filterOperatorDoesNotContain: 'شامل نباشد',
  filterOperatorEquals: 'برابر',
  filterOperatorDoesNotEqual: 'نابرابر',
  filterOperatorStartsWith: 'شروع شود با',
  filterOperatorEndsWith: 'پایان یابد با',
  filterOperatorIs: 'هست',
  filterOperatorNot: 'نیست',
  filterOperatorAfter: 'بعد از',
  filterOperatorOnOrAfter: 'در یا بعد از',
  filterOperatorBefore: 'قبل از',
  filterOperatorOnOrBefore: 'در یا قبل از',
  filterOperatorIsEmpty: 'خالی باشد',
  filterOperatorIsNotEmpty: 'خالی نباشد',
  filterOperatorIsAnyOf: 'یکی از',
  columnMenuLabel: 'منوی ستون',
  columnMenuShowColumns: 'مدیریت ستون‌ها',
  columnMenuFilter: 'فیلتر',
  columnMenuHideColumn: 'مخفی کردن ستون',
  columnMenuUnsort: 'حذف مرتب‌سازی',
  columnMenuSortAsc: 'مرتب‌سازی صعودی',
  columnMenuSortDesc: 'مرتب‌سازی نزولی',
  footerRowSelected: (count: number) => `${count.toLocaleString('fa-IR')} سطر انتخاب شده`,
  footerTotalRows: 'تعداد کل سطرها:'
};

export const DataTable = (props: DataGridProps) => {
  const { columns: inputColumns, sx: customSx, ...restProps } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const columns = useMemo(
    () =>
      (inputColumns ?? []).map((column) => {
        const col = column as GridColDef;
        if (!isDateLikeField(col.field) || col.valueFormatter) return col;

        return {
          ...col,
          valueFormatter: (value: string) => formatDateToJalali(value, value || '—')
        } as GridColDef;
      }),
    [inputColumns]
  );

  const responsiveColumns = useMemo(
    () =>
      columns.map((column) => {
        const col = column as GridColDef;
        if (!isMobile) return col;

        const minWidth = typeof col.minWidth === 'number' ? Math.min(col.minWidth, 120) : 95;
        return {
          ...col,
          width: undefined,
          minWidth,
          flex: col.flex ?? 1,
          sortable: col.sortable ?? false
        } as GridColDef;
      }),
    [columns, isMobile]
  );

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', overflowX: 'auto' }}>
      <Box sx={{ width: '100%', minWidth: 0, height: 520 }}>
        {props.loading ? (
          <Skeleton variant="rounded" height={520} />
        ) : (
          <DataGrid
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            localeText={faLocaleText}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            density={isMobile ? 'compact' : 'standard'}
            sx={[
              {
                minWidth: 0,
                '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                },
                '& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell': {
                  px: { xs: 1, sm: 1.5 }
                },
                '& .MuiDataGrid-main': {
                  overflowX: 'auto'
                },
                '& .MuiDataGrid-columnHeaders': {
                  minHeight: { xs: 42, sm: 56 }
                }
              },
              ...(Array.isArray(customSx) ? customSx : [customSx])
            ]}
            {...restProps}
            columns={responsiveColumns}
          />
        )}
      </Box>
    </Box>
  );
};
