import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import type { Theme } from '@mui/material/styles';
import type { Moment } from 'moment-jalaali';

const CustomDatePicker = (props: DatePickerProps<Moment>) => {
  return (
    <DatePicker
      {...props}
      slotProps={{
        ...props?.slotProps,
        textField: {
          fullWidth: true,
          ...props.slotProps?.textField
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
