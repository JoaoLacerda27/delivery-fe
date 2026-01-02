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
  Pagination,
  Stack,
  Tooltip,
} from '@mui/material';
import { Add, Visibility } from '@mui/icons-material';
import { listDeliveries } from '../services/deliveryService';
import type { Delivery } from '../types';
import type { Page } from '@/shared/types/pagination';
import { routes } from '@/app/routes';
import { toast } from 'react-toastify';
import { translateDeliveryStatus } from '@/shared/utils/statusTranslations';

const DeliveriesPage = () => {
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<Page<Delivery> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);

  const loadDeliveries = (page = 0) => {
    setLoading(true);
    listDeliveries(page, pageSize)
      .then(setPageData)
      .catch(() => {
        setError('Erro ao carregar entregas');
        toast.error('Erro ao carregar entregas');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeliveries(currentPage);
  }, [currentPage]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value - 1);
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

  const getStatusColor = (status: Delivery['status']) => {
    const colors: Record<Delivery['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      PENDING: 'warning',
      IN_TRANSIT: 'primary',
      DELIVERED: 'success',
      FAILED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatDeliveryAddress = (delivery: Delivery): string => {
    if (delivery.addressInfo) {
      return `${delivery.addressInfo.street}, ${delivery.addressInfo.neighborhood}, ${delivery.addressInfo.city} - ${delivery.addressInfo.state}, ${delivery.addressInfo.cep}`;
    }
    
    if (delivery.street && delivery.city) {
      return `${delivery.street}, ${delivery.city} - ${delivery.state}, ${delivery.zipCode}`;
    }
    
    if (delivery.address) {
      return `${delivery.address.street}, ${delivery.address.number}${delivery.address.complement ? ` - ${delivery.address.complement}` : ''}, ${delivery.address.neighborhood}, ${delivery.address.city} - ${delivery.address.state}, ${delivery.address.zipCode}`;
    }
    
    if (delivery.deliveryAddress) {
      return delivery.deliveryAddress;
    }
    
    return 'Endereço não disponível';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Entregas
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(`${routes.deliveries}/new`)}
        >
          Nova Entrega
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
            Nenhuma entrega encontrada.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate(`${routes.deliveries}/new`)}
            sx={{ mt: 2 }}
          >
            Criar Primeira Entrega
          </Button>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Pedido</TableCell>
                  <TableCell>Endereço de Entrega</TableCell>
                  <TableCell>Entregador</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageData.content.map((delivery) => (
                <TableRow key={delivery.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      #{delivery.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">#{delivery.orderId}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title={formatDeliveryAddress(delivery)} arrow>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          cursor: 'help',
                        }}
                      >
                        {formatDeliveryAddress(delivery)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {delivery.deliveryPersonName || (
                      <Typography variant="body2" color="text.secondary">
                        Não atribuído
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={translateDeliveryStatus(delivery.status)}
                      color={getStatusColor(delivery.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(delivery.createdAt).toLocaleDateString('pt-BR')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`${routes.deliveries}/${delivery.id}`}
                      color="primary"
                    >
                      <Visibility />
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
    </Container>
  );
};

export default DeliveriesPage;

