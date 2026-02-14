import { createTheme } from '@mui/material';

export const getTheme = (rtl: boolean) =>
  createTheme({
    direction: rtl ? 'rtl' : 'ltr',
    palette: {
      mode: 'light',
      primary: {
        main: '#3F51B5'
      },
      background: {
        default: '#f4f6fb'
      }
    },
    shape: {
      borderRadius: 12
    },
    typography: {
      fontFamily: 'Vazirmatn, IRANSansX, Inter, Roboto, system-ui, sans-serif',
      h5: { fontWeight: 700 }
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)'
          }
        }
      }
    }
  });
