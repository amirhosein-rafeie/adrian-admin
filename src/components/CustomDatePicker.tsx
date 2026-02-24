import { DatePicker, DatePickerProps } from "@mui/x-date-pickers";
const CustomDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      {...props}
      slotProps={{
        ...props?.slotProps,
        textField: {
          sx: {
            borderRadius: "0.3rem",
          },
          ...props.slotProps?.textField,
        },
        layout: {
          ...props.slotProps?.layout,
          sx: {
            backgroundColor: (theme) => theme.palette.background.paper,
            direction: "ltr",
            width: { xs: "100%", sm: 350 },
            ".MuiPickersDay-root": {
              borderRadius: 1.5,
              borderWidth: 0,
              border: "0px solid",
              width: 50,
              fontWeight: "900",
            },
            ".MuiDayCalendar-weekDayLabel": {
              width: 50,
              color: (theme) => theme.palette.primary.main,
              borderRadius: 0,
              borderWidth: 0,
              border: "0px solid",
              fontWeight: "bold",
            },
          },
        },
      }}
      localeText={{
        fieldDayPlaceholder: () => "روز",
        fieldMonthPlaceholder: () => "ماه",
        fieldYearPlaceholder: () => "سال",
      }}
      views={["year", "month", "day"]}
      closeOnSelect
    />
  );
};

export default CustomDatePicker;
