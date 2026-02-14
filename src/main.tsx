import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';
import { AppRouter } from '@/routes/AppRouter';
import { AppProviders } from '@/theme/AppProviders';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <CssBaseline />
        <AppRouter />
      </AppProviders>
    </QueryClientProvider>
  </React.StrictMode>
);
