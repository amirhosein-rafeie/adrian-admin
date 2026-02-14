import { ThemeProvider, createTheme } from '@mui/material';
import { useMemo } from 'react';
import { useAppContext } from '../hooks/useAppContext';

export const ThemeProviderWithDirection = ({ children }: { children: React.ReactNode }) => {
  const { isRtl } = useAppContext();

  const theme = useMemo(
    () =>
      createTheme({
        direction: isRtl ? 'rtl' : 'ltr',
        palette: {
          mode: 'light',
          primary: { main: '#3949ab' }
        },
        shape: {
          borderRadius: 12
        },
        typography: {
          fontFamily: 'Inter, Roboto, Arial, sans-serif'
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
      }),
    [isRtl]
  );

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </div>
  );
};
