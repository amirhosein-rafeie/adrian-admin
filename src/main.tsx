import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline } from '@mui/material';
import { AppRouter } from './routes/AppRouter';
import { ThemeProviderWithDirection } from './theme/ThemeProviderWithDirection';
import { AppProvider } from './hooks/useAppContext';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ThemeProviderWithDirection>
          <CssBaseline />
          <AppRouter />
        </ThemeProviderWithDirection>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
