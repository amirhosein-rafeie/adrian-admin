import { createTheme } from '@mui/material';

export const getTheme = (darkMode: boolean) =>
  createTheme({
    direction: 'ltr',
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#7C8CFF'
      },
      secondary: {
        main: '#5EEAD4'
      },
      background: {
        default: darkMode ? '#0B1120' : '#f4f6fb',
        paper: darkMode ? '#111A2F' : '#ffffff'
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
            boxShadow: darkMode ? '0 10px 30px rgba(2, 6, 23, 0.45)' : '0 8px 24px rgba(15, 23, 42, 0.06)',
            backgroundImage: 'none'
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none'
          }
        }
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundImage: 'none'
          }
        }
      }
    }
  });
