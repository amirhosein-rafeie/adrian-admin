import {
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ReactNode } from 'react';

declare module '@mui/material/styles' {
  interface Palette {
    dark: Palette['primary'];
  }
  interface PaletteOptions {
    dark?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    dark: true;
  }
}

let theme = createTheme({
  direction: 'rtl',
  palette: {
    mode: 'dark',
    dark: { main: '#151a1f', contrastText: '#f8fafc' },
    primary: {
      main: '#ff6f3c',
      light: '#ff9468',
      dark: '#d9480f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#2563eb',
      contrastText: '#06121f',
    },
    background: {
      default: '#101418',
      paper: '#182028',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      disabled: '#94a3b8',
    },
    divider: alpha('#f8fafc', 0.12),
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    error: { main: '#ef4444' },
    info: { main: '#38bdf8' },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Vazirmatn, IRANSansX, Inter, Roboto, system-ui, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 600 },
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

        html,
        body,
        #root {
          font-family: 'Vazirmatn', IRANSansX, Inter, Roboto, system-ui, sans-serif;
        }

        body {
          background-image:
            radial-gradient(circle at top right, rgba(255, 111, 60, 0.16), transparent 40%),
            radial-gradient(circle at bottom left, rgba(96, 165, 250, 0.1), transparent 50%);
        }
      `,
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: alpha('#f8fafc', 0.04),
            borderRadius: 10,
          },
          '& .MuiInputLabel-root': {
            color: '#cbd5e1',
          },
          '& .MuiInputBase-input': {
            color: '#f8fafc',
            padding: '12px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#f8fafc', 0.2),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: alpha('#f8fafc', 0.4),
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#ff6f3c',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: `1px solid ${alpha('#f8fafc', 0.08)}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${alpha('#f8fafc', 0.08)}`,
          boxShadow: `0 14px 30px ${alpha('#020617', 0.35)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecorationColor: alpha('#ff6f3c', 0.5),
          '&:hover': {
            textDecorationColor: '#ff6f3c',
          },
        },
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        fullWidth: true,
        disablePortal: true,
        noOptionsText: 'موردی یافت نشد',
        slotProps: {
          paper: {
            sx: {
              border: (theme) => `1px solid ${theme.palette.divider}`,
            },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: {
        sx: {
          '&.MuiCheckbox-root': {
            color: (theme) => theme.palette.primary.main,
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const MUIGlobalThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--background': theme.palette.background.default,
            '--surface': theme.palette.background.paper,
            '--primary': theme.palette.primary.main,
            '--primary-contrast': theme.palette.primary.contrastText,
            '--text-primary': theme.palette.text.primary,
            '--text-secondary': theme.palette.text.secondary,
            '--divider': theme.palette.divider,
          },
        }}
      />
      {children}
    </ThemeProvider>
  );
};

export default MUIGlobalThemeProvider;
