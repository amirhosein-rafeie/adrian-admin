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
  Typography
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import TokenIcon from '@mui/icons-material/Token';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppSettings } from '@/theme/AppProviders';

const drawerWidth = 240;
const collapsedWidth = 72;

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Projects', path: '/projects', icon: <WorkspacesIcon /> },
  { label: 'Tokens', path: '/tokens', icon: <TokenIcon /> },
  { label: 'Transactions', path: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'Bank Accounts', path: '/banks', icon: <AccountBalanceIcon /> },
  { label: 'Orders', path: '/orders', icon: <ShoppingBagIcon /> }
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { rtl, toggleRtl } = useAppSettings();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} dir={rtl ? 'rtl' : 'ltr'}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Toolbar>
          <IconButton onClick={() => setCollapsed((v) => !v)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
            Adrian Admin
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">RTL</Typography>
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
            borderRight: '1px solid #e5e7eb',
            mt: 8
          }
        }}
      >
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
