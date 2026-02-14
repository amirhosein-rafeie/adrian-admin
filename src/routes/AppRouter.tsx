import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { AdminLayout } from '../layouts/AdminLayout';
import { BanksPage } from '../features/banks/BanksPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { OrdersPage } from '../features/orders/OrdersPage';
import { ProjectsPage } from '../features/projects/ProjectsPage';
import { TokensPage } from '../features/tokens/TokensPage';
import { TransactionsPage } from '../features/transactions/TransactionsPage';
import { RoleGuard } from './RoleGuard';

export const AppRouter = () => (
  <Router>
    <ErrorBoundary>
      <RoleGuard>
        <Routes>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/tokens" element={<TokensPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/banks" element={<BanksPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </RoleGuard>
    </ErrorBoundary>
  </Router>
);
