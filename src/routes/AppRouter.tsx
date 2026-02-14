import { Navigate, Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { TokensPage } from '@/features/tokens/TokensPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { BanksPage } from '@/features/banks/BanksPage';
import { OrdersPage } from '@/features/orders/OrdersPage';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RoleGuard } from './RoleGuard';

export const AppRouter = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        <Route
          element={
            <RoleGuard>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/banks" element={<BanksPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
);
