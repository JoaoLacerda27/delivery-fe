import { Outlet, useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { Logout, ShoppingCart, LocalShipping } from '@mui/icons-material';
import { useAuthStore } from '@/features/auth/store/authStore';
import { routes } from '@/app/routes';
import { logoutApi } from '@/features/auth/api/authApi';
import { toast } from 'react-toastify';

const MainLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error('Error on logout:', err);
    } finally {
      logout();
      toast.success('Logout realizado com sucesso');
      navigate(routes.login);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} to={routes.orders} sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            Delivery Platform
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              color="inherit"
              component={Link}
              to={routes.orders}
              startIcon={<ShoppingCart />}
            >
              Pedidos
            </Button>
            <Button
              color="inherit"
              component={Link}
              to={routes.deliveries}
              startIcon={<LocalShipping />}
            >
              Entregas
            </Button>
            <IconButton color="inherit" onClick={handleLogout} title="Logout">
              <Logout />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Container 
        maxWidth={false} 
        sx={{ 
          mt: { xs: 2, sm: 4 }, 
          mb: { xs: 2, sm: 4 },
          px: { xs: 1, sm: 3 },
          minHeight: 'auto',
          overflow: 'visible',
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;

