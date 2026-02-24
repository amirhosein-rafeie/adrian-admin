import { TextField } from '@mui/material';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import type { SxProps } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import type { Moment } from 'moment-jalaali';

const CustomDatePicker = (props: DatePickerProps<Moment>) => {
  const textFieldSx = props.slotProps?.textField && 'sx' in props.slotProps.textField
    ? (props.slotProps.textField.sx as SxProps<Theme>)
    : undefined;

  return (
    <DatePicker
      {...props}
      slots={{
        ...props.slots,
        textField: TextField
      }}
      enableAccessibleFieldDOMStructure={false}
      slotProps={{
        ...props?.slotProps,
        textField: {
          ...props.slotProps?.textField,
          fullWidth: true,
          variant: props.slotProps?.textField?.variant ?? 'outlined',
          size: props.slotProps?.textField?.size ?? 'medium',
          sx: [
            {
              '& .MuiInputBase-root': {
                minHeight: 56,
                backgroundColor: 'transparent'
              }
            },
            ...(Array.isArray(textFieldSx) ? textFieldSx : textFieldSx ? [textFieldSx] : [])
          ]
        },
        layout: {
          ...props.slotProps?.layout,
          sx: {
            direction: 'ltr',
            width: { xs: '100%', sm: 350 },
            maxWidth: '100%',
            '.MuiPickersDay-root': {
              borderRadius: 1.5,
              borderWidth: 0,
              border: '0px solid',
              width: { xs: 38, sm: 44 },
              height: { xs: 38, sm: 44 },
              fontWeight: '900'
            },
            '.MuiDayCalendar-weekDayLabel': {
              width: { xs: 38, sm: 44 },
              color: (theme: Theme) => theme.palette.primary.main,
              borderRadius: 0,
              borderWidth: 0,
              border: '0px solid',
              fontWeight: 'bold'
            }
          }
        }
      }}
      localeText={{
        fieldDayPlaceholder: () => 'روز',
        fieldMonthPlaceholder: () => 'ماه',
        fieldYearPlaceholder: () => 'سال'
      }}
      views={['year', 'month', 'day']}
      closeOnSelect={false}
    />
  );
};

export default CustomDatePicker;
