import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Stack,
} from '@mui/material';
import { Add, Visibility, Delete } from '@mui/icons-material';
import { listOrders, deleteOrder } from '../services/orderService';
import type { Order } from '../types';
import type { Page } from '@/shared/types/pagination';
import { routes } from '@/app/routes';
import { toast } from 'react-toastify';
import { translateOrderStatus } from '@/shared/utils/statusTranslations';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<Page<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const loadOrders = (page = 0) => {
    setLoading(true);
    listOrders(page, pageSize)
      .then(setPageData)
      .catch(() => {
        setError('Erro ao carregar pedidos');
        toast.error('Erro ao carregar pedidos');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
  };

  const handleDeleteClick = (orderId: string) => {
    setOrderToDelete(orderId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;

    setDeleting(true);
    try {
      await deleteOrder(orderToDelete);
      toast.success('Pedido excluído com sucesso!');
      loadOrders(currentPage);
    } catch (err) {
      toast.error('Erro ao excluir pedido');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Pedidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(`${routes.orders}/new`)}
        >
          Novo Pedido
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : !pageData || pageData.content.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Nenhum pedido encontrado.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`${routes.orders}/new`)}
            sx={{ mt: 2 }}
          >
            Criar Primeiro Pedido
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Itens</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageData.content.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{order.id}
                    </Typography>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.items.length} item(s)</TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight="medium" color="primary">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={translateOrderStatus(order.status as Order['status'] | 'CREATED')}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`${routes.orders}/${order.id}`}
                      color="primary"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(order.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {pageData.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Stack spacing={2}>
                <Pagination
                  count={pageData.totalPages}
                  page={currentPage + 1}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Página {currentPage + 1} de {pageData.totalPages} ({pageData.totalElements} total)
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" disabled={deleting}>
            {deleting ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage;

