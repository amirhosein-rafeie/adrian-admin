import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/services/queryClient';
import { AppRouter } from '@/routes/AppRouter';
import { AppProviders } from '@/theme/AppProviders';
import { withMUIProviders } from '@/HOC/withMUIProviders';

const AppRouterWithMUI = withMUIProviders(AppRouter);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <CssBaseline />
        <AppRouterWithMUI />
      </AppProviders>
    </QueryClientProvider>
  </React.StrictMode>
);
