import { ThemeProvider } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { getTheme } from './theme';

interface AppSettingsContextValue {
  rtl: boolean;
  toggleRtl: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue>({
  rtl: true,
  toggleRtl: () => undefined,
  darkMode: true,
  toggleDarkMode: () => undefined
});

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [rtl, setRtl] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const theme = useMemo(() => getTheme(rtl, darkMode), [rtl, darkMode]);

  return (
    <AppSettingsContext.Provider
      value={{
        rtl,
        toggleRtl: () => setRtl((v) => !v),
        darkMode,
        toggleDarkMode: () => setDarkMode((v) => !v)
      }}
    >
      <ThemeProvider theme={theme}>
        <SnackbarProvider>{children}</SnackbarProvider>
      </ThemeProvider>
    </AppSettingsContext.Provider>
  );
};
