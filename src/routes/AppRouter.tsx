import { BrowserRouter } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoginPage } from '@/features/auth/LoginPage';
import { BanksPage } from '@/features/banks/BanksPage';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { OrdersPage } from '@/features/orders/OrdersPage';
import { ProjectsPage } from '@/features/projects/ProjectsPage';
import { CreateProjectPage } from '@/features/projects/CreateProjectPage';
import { EditProjectPage } from '@/features/projects/EditProjectPage';
import { TokensPage } from '@/features/tokens/TokensPage';
import { UsersPage } from '@/features/users/UsersPage';
import { VerificationsPage } from '@/features/verifications/VerificationsPage';
import { TransactionsPage } from '@/features/transactions/TransactionsPage';
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
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id/edit" element={<EditProjectPage />} />
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
