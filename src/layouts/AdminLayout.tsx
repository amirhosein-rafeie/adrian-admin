import {
  AppBar,
  Box,
  Drawer,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Toolbar,
  useTheme,
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import TokenIcon from '@mui/icons-material/Token';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppSettings } from '@/theme/AppProviders';

const drawerWidth = 240;
const collapsedWidth = 72;

const navItems = [
  { label: 'داشبورد', path: '/', icon: <DashboardIcon /> },
  { label: 'پروژه‌ها', path: '/projects', icon: <WorkspacesIcon /> },
  { label: 'توکن‌ها', path: '/tokens', icon: <TokenIcon /> },
  { label: 'تراکنش‌ها', path: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'حساب‌های بانکی', path: '/banks', icon: <AccountBalanceIcon /> },
  { label: 'سفارش‌ها', path: '/orders', icon: <ShoppingBagIcon /> }
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, toggleDarkMode } = useAppSettings();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} dir="rtl">
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton onClick={() => setCollapsed((v) => !v)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            پنل مدیریت آدریان
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            {darkMode ? <DarkModeIcon fontSize="small" color="primary" /> : <LightModeIcon fontSize="small" color="primary" />}
            <Typography variant="body2">حالت تیره</Typography>
            <Switch checked={darkMode} onChange={toggleDarkMode} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderLeft: '1px solid',
            borderColor: 'divider',
            mt: 8
          }
        }}
      >
        <Stack alignItems="center" spacing={1} sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box
            component="img"
            src="/adrinex-logo.svg"
            alt="Adrinex Logo"
            sx={{
              width: collapsed ? 36 : 122,
              height: 'auto',
              borderRadius: 1,
              p: collapsed ? 0.5 : 0,
              bgcolor: darkMode ? 'transparent' : '#000'
            }}
          />
          {!collapsed ? (
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              ADRINEX Admin Panel
            </Typography>
          ) : null}
        </Stack>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} /> : null}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, mr: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
};
