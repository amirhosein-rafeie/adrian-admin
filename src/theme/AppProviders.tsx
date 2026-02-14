import { ThemeProvider } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { getTheme } from './theme';

interface AppSettingsContextValue {
  rtl: boolean;
  toggleRtl: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue>({ rtl: false, toggleRtl: () => undefined });

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [rtl, setRtl] = useState(false);
  const theme = useMemo(() => getTheme(rtl), [rtl]);

  return (
    <AppSettingsContext.Provider value={{ rtl, toggleRtl: () => setRtl((v) => !v) }}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </AppSettingsContext.Provider>
  );
};
