import {
  DatePicker,
  DatePickerProps,
  MonthCalendar,
} from "@mui/x-date-pickers";

const CustomDatePicker = (props: DatePickerProps) => {
  return (
    <DatePicker
      {...props}
      slots={{
        monthButton: (props) => {
          return (
            <MonthCalendar {...props}>{props["aria-label"]}</MonthCalendar>
          );
        },
      }}
      slotProps={{
        ...props?.slotProps,
        textField: {
          sx: {
            background: "white",
            borderRadius: "0.3rem",
          },
          ...props.slotProps?.textField,
        },
        layout: {
          ...props.slotProps?.layout,
          sx: {
            direction: "ltr",
            width: 350,
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
      closeOnSelect={false}
    />
  );
};

export default CustomDatePicker;
