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
      <Box sx={{ width: '100%', minWidth: 0, height: 520 }}>
        {props.loading ? (
          <Skeleton variant="rounded" height={520} />
        ) : (
          <DataGrid
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20]}
            localeText={faLocaleText}
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            sx={{ minWidth: { xs: 760, md: 0 } }}
            {...props}
            columns={columns}
          />
        )}
      </Box>
    </Box>
  );
};
