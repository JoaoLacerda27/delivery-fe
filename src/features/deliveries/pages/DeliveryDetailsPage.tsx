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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  AccessTime,
  Person,
  LocalShipping,
} from '@mui/icons-material';
import { getDeliveryById, updateDeliveryStatus } from '../services/deliveryService';
import type { Delivery } from '../types';
import { routes } from '@/app/routes';
import { toast } from 'react-toastify';
import { translateDeliveryStatus } from '@/shared/utils/statusTranslations';

const DeliveryDetailsPage = () => {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!deliveryId) {
      setError('ID da entrega não fornecido');
      setLoading(false);
      return;
    }

    getDeliveryById(deliveryId, true)
      .then(setDelivery)
      .catch((err) => {
        setError('Erro ao carregar detalhes da entrega');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [deliveryId]);

  const handleStatusUpdate = async (newStatus: Delivery['status']) => {
    if (!deliveryId) return;

    setUpdating(true);
    try {
      await updateDeliveryStatus(deliveryId, newStatus);
      const deliveryWithTracking = await getDeliveryById(deliveryId, true);
      setDelivery(deliveryWithTracking);
      toast.success('Status atualizado com sucesso!');
    } catch (err) {
      toast.error('Erro ao atualizar status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: Delivery['status']) => {
    const colors: Record<Delivery['status'], 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
      PENDING: 'warning',
      IN_TRANSIT: 'primary',
      DELIVERED: 'success',
      FAILED: 'error',
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleString('pt-BR');
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

  if (error || !delivery) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error || 'Entrega não encontrada'}</Alert>
        <Button
          component={Link}
          to={routes.deliveries}
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Voltar para Entregas
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(routes.deliveries)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography variant="h4" component="h1">
            Detalhes da Entrega
          </Typography>
          <Chip
            label={translateDeliveryStatus(delivery.status)}
            color={getStatusColor(delivery.status)}
            size="medium"
          />
        </Box>
      </Box>

      <Box>
        {/* Informações Principais */}
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações da Entrega
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ID da Entrega
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {delivery.id}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  ID do Pedido
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {delivery.orderId}
                </Typography>
              </Box>
              {delivery.deliveryPersonName && (
                <Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Person fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Entregador
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {delivery.deliveryPersonName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTime fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Criado em
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {formatDate(delivery.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Endereço */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOn color="primary" />
              <Typography variant="h6">Endereço de Entrega</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {delivery.addressInfo ? (
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {delivery.addressInfo.street}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {delivery.addressInfo.neighborhood}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {delivery.addressInfo.city} - {delivery.addressInfo.state}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  CEP: {delivery.addressInfo.cep}
                </Typography>
              </Box>
            ) : delivery.street && delivery.city ? (
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {delivery.street}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {delivery.city} - {delivery.state}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  CEP: {delivery.zipCode}
                </Typography>
              </Box>
            ) : delivery.address ? (
              <Box>
                <Typography variant="body1" fontWeight="medium">
                  {delivery.address.street}, {delivery.address.number}
                  {delivery.address.complement && ` - ${delivery.address.complement}`}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {delivery.address.neighborhood}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {delivery.address.city} - {delivery.address.state}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  CEP: {delivery.address.zipCode}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" color="text.secondary">
                Endereço não disponível
              </Typography>
            )}
          </Paper>

          {/* Tracking Events */}
          {delivery.events && delivery.events.length > 0 && (
            <Paper sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocalShipping color="primary" />
                <Typography variant="h6">Histórico de Rastreamento</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <List>
                {delivery.events.map((event, index) => {
                  const eventDate = event.occurredAt || event.createdAt;
                  const eventDescription = event.description || event.type || 'Evento de rastreamento';
                  
                  let translatedDescription = eventDescription;
                  
                  if (eventDescription.includes('Delivery created')) {
                    translatedDescription = 'Entrega criada';
                  } else if (eventDescription.includes('for order')) {
                    translatedDescription = eventDescription.replace('Delivery created for order', 'Entrega criada para o pedido');
                  } else if (eventDescription.includes('Status updated to')) {
                    const statusMatch = eventDescription.match(/Status updated to (\w+)/);
                    if (statusMatch) {
                      const status = statusMatch[1];
                      const statusTranslated = translateDeliveryStatus(status as Delivery['status']);
                      translatedDescription = `Status atualizado para ${statusTranslated}`;
                    } else {
                      translatedDescription = eventDescription.replace('Status updated to', 'Status atualizado para');
                    }
                  } else if (eventDescription.includes('IN_TRANSIT')) {
                    translatedDescription = eventDescription.replace('IN_TRANSIT', 'Em Trânsito');
                  } else if (eventDescription.includes('DELIVERED')) {
                    translatedDescription = eventDescription.replace('DELIVERED', 'Entregue');
                  } else if (eventDescription.includes('PENDING')) {
                    translatedDescription = eventDescription.replace('PENDING', 'Pendente');
                  } else if (eventDescription.includes('FAILED')) {
                    translatedDescription = eventDescription.replace('FAILED', 'Falhou');
                  }
                  
                  return (
                    <Box key={event.id || index}>
                      <ListItem>
                        <ListItemText
                          primary={translatedDescription}
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(eventDate || null)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < delivery.events!.length - 1 && <Divider variant="inset" component="li" />}
                    </Box>
                  );
                })}
              </List>
            </Paper>
          )}

        {/* Ações */}
        <Paper sx={{ p: 3, mt: 3, width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Ações
              </Typography>
              <Divider sx={{ mb: 2 }} />

            <Box 
              display="flex" 
              flexDirection={{ xs: 'column', sm: 'row' }}
              gap={2}
              flexWrap="wrap"
            >
              {delivery.status === 'PENDING' && (
                <Button
                  variant="contained"
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    flex: { xs: '1 1 100%', sm: '1 1 auto' } 
                  }}
                  onClick={() => handleStatusUpdate('IN_TRANSIT')}
                  disabled={updating}
                >
                  Iniciar Entrega
                </Button>
              )}
              {delivery.status === 'IN_TRANSIT' && (
                <Button
                  variant="contained"
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    flex: { xs: '1 1 100%', sm: '1 1 auto' } 
                  }}
                  color="success"
                  onClick={() => handleStatusUpdate('DELIVERED')}
                  disabled={updating}
                >
                  Marcar como Entregue
                </Button>
              )}
              {delivery.status !== 'DELIVERED' && delivery.status !== 'FAILED' && (
                <Button
                  variant="outlined"
                  sx={{ 
                    width: { xs: '100%', sm: 'auto' },
                    flex: { xs: '1 1 100%', sm: '1 1 auto' } 
                  }}
                  color="error"
                  onClick={() => handleStatusUpdate('FAILED')}
                  disabled={updating}
                >
                  Marcar como Falhou
                </Button>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ width: '100%' }}>
              <Button
                variant="outlined"
                fullWidth
                component={Link}
                to={`${routes.orders}/${delivery.orderId}`}
                sx={{ width: '100%', minWidth: '100%' }}
              >
                Ver Pedido Relacionado
              </Button>
            </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default DeliveryDetailsPage;

