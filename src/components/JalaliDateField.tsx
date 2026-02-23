import { TextField, TextFieldProps } from '@mui/material';

export const JalaliDateField = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      placeholder={props.placeholder ?? '۱۴۰۴/۰۱/۱۵'}
      inputProps={{
        dir: 'ltr',
        ...props.inputProps,
      }}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 1.5,
          bgcolor: 'common.white',
        },
        ...props.sx,
      }}
    />
  );
};
