import { BrowserRouter } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginPage } from '@/features/auth/LoginPage';
import { BanksPage } from '@/features/banks/BanksPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { OrdersPage } from '@/features/orders/OrdersPage';
import { ProjectCreatePage } from '@/features/projects/ProjectCreatePage';
import { ProjectEditPage } from '@/features/projects/ProjectEditPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { TokensPage } from '@/features/tokens/TokensPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
import { UsersPage } from '@/features/users/UsersPage';
import { VerificationsPage } from '@/features/verifications/VerificationsPage';
import { AdminLayout } from '@/layouts/AdminLayout';
import { auth } from '@/services/auth';
import { RoleGuard } from './RoleGuard';

export const AppRouter = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={auth.isAuthenticated() ? <Navigate to="/" replace /> : <LoginPage />} />
        <Route
          element={
            <RoleGuard>
              <AdminLayout />
            </RoleGuard>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/create" element={<ProjectCreatePage />} />
          <Route path="/projects/:id/edit" element={<ProjectEditPage />} />
          <Route path="/tokens" element={<TokensPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/banks" element={<BanksPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/verifications" element={<VerificationsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  </BrowserRouter>
);
