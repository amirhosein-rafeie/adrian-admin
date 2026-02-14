import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppBar, Box, Drawer, IconButton, List, ListItemButton, ListItemText, Switch, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';

const links = [
  { label: 'Dashboard', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Tokens', path: '/tokens' },
  { label: 'Transactions', path: '/transactions' },
  { label: 'Bank Accounts', path: '/banks' },
  { label: 'Orders', path: '/orders' }
];

export const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isRtl, toggleDirection } = useAppContext();
  const location = useLocation();

  const width = collapsed ? 80 : 240;

  return (
    <Box display="flex" minHeight="100vh" bgcolor="#f7f9fc">
      <Drawer variant="permanent" sx={{ width, flexShrink: 0, '& .MuiDrawer-paper': { width, boxSizing: 'border-box' } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {!collapsed && <Typography fontWeight={700}>Admin</Typography>}
          <IconButton onClick={() => setCollapsed((p) => !p)}>{collapsed ? <ChevronRight /> : <ChevronLeft />}</IconButton>
        </Toolbar>
        <List>
          {links.map((link) => (
            <ListItemButton key={link.path} component={Link} to={link.path} selected={location.pathname === link.path} sx={{ justifyContent: collapsed ? 'center' : 'flex-start' }}>
              <ListItemText primary={collapsed ? link.label[0] : link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
      <Box flexGrow={1}>
        <AppBar position="sticky" color="inherit" elevation={0}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Production Admin Dashboard</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">RTL</Typography>
              <Switch checked={isRtl} onChange={toggleDirection} />
            </Box>
          </Toolbar>
        </AppBar>
        <Box p={{ xs: 2, md: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};
