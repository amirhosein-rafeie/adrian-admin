import { ThemeProvider } from '@mui/material';
import { useEffect } from 'react';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { getTheme } from './theme';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'fa');
  }, []);

  return (
    <ThemeProvider theme={getTheme()}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </ThemeProvider>
  );
};
