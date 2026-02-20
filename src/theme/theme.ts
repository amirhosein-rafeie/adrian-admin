import { createTheme } from '@mui/material';

export const getTheme = () =>
  createTheme({
    direction: 'rtl',
    palette: {
      mode: 'light',
      primary: {
        main: '#7C8CFF'
      },
      secondary: {
        main: '#5EEAD4'
      },
      background: {
        default: '#f4f6fb',
        paper: '#ffffff'
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
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Vazirmatn';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url('/fonts/Vazirmatn-Regular.ttf') format('truetype');
          }

          html, body, #root {
            font-family: 'Vazirmatn', IRANSansX, Inter, Roboto, system-ui, sans-serif;
            overflow-x: hidden;
          }
        `
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
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
