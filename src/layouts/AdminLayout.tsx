import {
  AppBar,
  Box,
  Drawer,
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
  const { rtl, toggleRtl, darkMode, toggleDarkMode } = useAppSettings();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} dir={rtl ? 'rtl' : 'ltr'}>
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
            <Typography variant="body2">حالت راست‌به‌چپ</Typography>
            <Switch checked={rtl} onChange={toggleRtl} />
          </Stack>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            mt: 8
          }
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, pt: 2, pb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: darkMode
                ? 'linear-gradient(135deg, rgba(124,140,255,0.95), rgba(94,234,212,0.75))'
                : 'linear-gradient(135deg, #3F51B5, #00B8A9)',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 700,
              fontSize: 14,
              boxShadow: darkMode ? '0 10px 20px rgba(0,0,0,0.35)' : '0 8px 20px rgba(63,81,181,0.25)'
            }}
          >
            AD
          </Box>
          {!collapsed ? (
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Adrian Admin
              </Typography>
              <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                Design System
              </Typography>
            </Box>
          ) : null}
        </Stack>
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.path} selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              {!collapsed ? <ListItemText primary={item.label} /> : null}
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, ml: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px` }}>
        <Outlet />
      </Box>
    </Box>
  );
};
