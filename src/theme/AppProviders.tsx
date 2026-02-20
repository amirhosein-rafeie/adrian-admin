import { ThemeProvider } from '@mui/material';
import { createContext, useContext, useMemo, useState } from 'react';
import { SnackbarProvider } from '@/hooks/useSnackbar';
import { getTheme } from './theme';

interface AppSettingsContextValue {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextValue>({
  darkMode: true,
  toggleDarkMode: () => undefined
});

export const useAppSettings = () => useContext(AppSettingsContext);

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  return (
    <AppSettingsContext.Provider
      value={{
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
