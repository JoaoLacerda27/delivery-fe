import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { ArrowBack, Add, LocalShipping } from '@mui/icons-material';
import { getOrderById } from '../services/orderService';
import { getDeliveryByOrderId } from '@/features/deliveries/services/deliveryService';
import type { Order } from '../types';
import type { Delivery } from '@/features/deliveries/types';
import { routes } from '@/app/routes';
import { translateOrderStatus } from '@/shared/utils/statusTranslations';

const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDelivery, setLoadingDelivery] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setError('ID do pedido não fornecido');
      setLoading(false);
      setLoadingDelivery(false);
      return;
    }

    getOrderById(orderId)
      .then((data) => {
        if (data && !Array.isArray(data.items)) {
          data.items = data.items ? [data.items] : [];
        }
        setOrder(data);
      })
      .catch((err) => {
        setError('Erro ao carregar detalhes do pedido');
        console.error(err);
      })
      .finally(() => setLoading(false));

    getDeliveryByOrderId(orderId)
      .then((deliveryData) => {
        setDelivery(deliveryData);
      })
      .catch((err) => {
        console.error('Erro ao verificar entrega:', err);
      })
      .finally(() => setLoadingDelivery(false));
  }, [orderId]);

  const getStatusColor = (status: Order['status'] | 'CREATED') => {
    const colors: Record<Order['status'] | 'CREATED', 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
      CREATED: 'info',
      PENDING: 'warning',
      CONFIRMED: 'primary',
      PREPARING: 'primary',
      READY: 'success',
      IN_DELIVERY: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Pedido não encontrado'}</Alert>
        <Button
          component={Link}
          to={routes.orders}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Voltar para Pedidos
        </Button>
      </Container>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: { xs: 2, sm: 4 }, 
        mb: { xs: 2, sm: 4 },
        px: { xs: 2, sm: 3 },
        minHeight: 'auto',
        overflow: 'visible',
      }}
    >
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(routes.orders)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="h5" component="h1">
            Pedido #{order.id}
          </Typography>
          <Chip
            label={translateOrderStatus(order.status as Order['status'] | 'CREATED')}
            color={getStatusColor(order.status)}
            size="medium"
          />
        </Box>
      </Box>

      <Box sx={{ pb: 2 }}>
        <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3, width: '100%' }}>
          <Typography variant="h6" gutterBottom align="center">
            Informações do Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
              justifyContent: 'center',
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" align="center">
                ID do Cliente
              </Typography>
              <Typography variant="body1" fontWeight="medium" align="center">
                {order.customerId}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Nome do Cliente
              </Typography>
              <Typography variant="body1" fontWeight="medium" align="center">
                {order.customerName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" align="center">
                Criado em
              </Typography>
              <Typography variant="body1" fontWeight="medium" align="center">
                {new Date(order.createdAt).toLocaleString('pt-BR')}
              </Typography>
            </Box>
            <Box>
              {loadingDelivery ? (
                <Box display="flex" justifyContent="center" sx={{ mt: 4 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : delivery ? (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<LocalShipping />}
                  component={Link}
                  to={routes.deliveryDetail(delivery.id)}
                  sx={{ mt: 4 }}
                  color="success"
                >
                  Ir para Entrega
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<Add />}
                  component={Link}
                  to={`${routes.createDelivery}?orderId=${order.id}`}
                  sx={{ mt: 4 }}
                >
                  Criar Entrega
                </Button>
              )}
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, sm: 3 }, width: '100%' }}>
          <Typography variant="h6" gutterBottom align="center">
            Itens do Pedido
          </Typography>
          <Divider sx={{ mb: 2 }} />
            <TableContainer 
              sx={{ 
                maxHeight: { xs: 'none', sm: 600 }, 
                overflowX: 'auto',
                overflowY: 'visible',
              }}
            >
              <Table size="small" sx={{ minWidth: 300 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Produto</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Quantidade</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Preço Unit.</TableCell>
                    <TableCell align="right" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <TableRow key={item.id || index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(item.quantity * item.price)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary">
                          Nenhum item encontrado
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={3} align="right">
                      <Typography variant="h6">Total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="h6" color="primary">
                        {formatCurrency(order.totalAmount)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
      </Box>
    </Container>
  );
};

export default OrderDetailPage;

