import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import TokenIcon from '@mui/icons-material/Token';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PeopleIcon from '@mui/icons-material/People';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '@/services/auth';

const drawerWidth = 240;
const compactDrawerWidth = 80;

const navItems = [
  { label: 'داشبورد', path: '/', icon: <DashboardIcon /> },
  { label: 'پروژه‌ها', path: '/projects', icon: <WorkspacesIcon /> },
  { label: 'توکن‌ها', path: '/tokens', icon: <TokenIcon /> },
  { label: 'تراکنش‌ها', path: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'حساب‌های بانکی', path: '/banks', icon: <AccountBalanceIcon /> },
  { label: 'سفارش‌ها', path: '/orders', icon: <ShoppingBagIcon /> },
  { label: 'کاربران', path: '/users', icon: <PeopleIcon /> },
  { label: 'احراز هویت', path: '/verifications', icon: <VerifiedUserIcon /> },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            پنل مدیریت آدریان
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              auth.clearToken();
              navigate('/login', { replace: true });
            }}
          >
            خروج
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: { xs: compactDrawerWidth, md: drawerWidth },
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: { xs: compactDrawerWidth, md: drawerWidth },
            boxSizing: 'border-box',
            borderLeft: '1px solid',
            borderColor: 'divider',
            mt: 8,
            overflowX: 'hidden',
          },
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box
            component="img"
            src="/adrinex-logo.svg"
            alt="Adrinex Logo"
            sx={{
              width: { xs: 44, md: 122 },
              height: 'auto',
              borderRadius: 1,
              bgcolor: '#000',
              p: { xs: 0.5, md: 0 },
            }}
          />
        </Stack>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} sx={{ display: { xs: 'none', md: 'block' } }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1.5, md: 3 },
          mt: 8,
          mr: { xs: `${compactDrawerWidth}px`, md: `${drawerWidth}px` },
          minWidth: 0,
          overflowX: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
