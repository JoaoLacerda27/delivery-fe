import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { routes } from '@/app/routes';
import { getLoginSuccess } from '../api/authApi';
import { toast } from 'react-toastify';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const token = searchParams.get('token');
    const name = searchParams.get('name');

    if (errorParam) {
      setError('Erro ao fazer login com Google');
      toast.error('Erro ao fazer login com Google');
      setTimeout(() => navigate(routes.login), 2000);
      return;
    }

    if (token) {
      login(token);
      const welcomeMessage = name ? `Bem-vindo, ${name}!` : 'Login realizado com sucesso!';
      toast.success(welcomeMessage);
      navigate(routes.orders);
      return;
    }

    getLoginSuccess()
      .then((data) => {
        if (data && data.token) {
          login(data.token);
          toast.success(`Bem-vindo, ${data.name}!`);
          navigate(routes.orders);
        } else {
          throw new Error('Token não encontrado na resposta');
        }
      })
      .catch((err) => {
        console.error('Error fetching login success:', err);
        setError('Erro ao processar autenticação. Tente fazer login novamente.');
        toast.error('Erro ao processar autenticação');
        setTimeout(() => navigate(routes.login), 3000);
      });
  }, [searchParams, navigate, login]);

  if (error) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Redirecionando para a página de login...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1">Processando login com Google...</Typography>
    </Box>
  );
};

export default GoogleCallbackPage;

