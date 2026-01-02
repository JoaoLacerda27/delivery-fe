import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createDelivery, getAddressByCep } from '../services/deliveryService';
import { listOrders } from '@/features/orders/services/orderService';
import type { Order } from '@/features/orders/types';
import type { Page } from '@/shared/types/pagination';
import { routes } from '@/app/routes';
import { toast } from 'react-toastify';

const deliverySchema = z.object({
  orderId: z.string().min(1, 'Selecione um pedido'),
  deliveryAddress: z.object({
    street: z.string().min(1, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    complement: z.string().optional(),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
  }),
});

type DeliveryFormData = z.infer<typeof deliverySchema>;

const CreateDeliveryPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  const orderIdParam = searchParams.get('orderId');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      orderId: orderIdParam || '',
      deliveryAddress: {
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
      },
    },
  });

  useEffect(() => {
    listOrders(0, 100) // Buscar muitos pedidos para o dropdown
      .then((pageData: Page<Order>) => {
        const createdOrders = (pageData.content || []).filter(
          (order) => order.status === 'CREATED' || (order.status as string) === 'CREATED'
        );
        setOrders(createdOrders);
      })
      .catch(() => {
        toast.error('Erro ao carregar pedidos');
        setOrders([]);
      })
      .finally(() => setLoadingOrders(false));
  }, []);

  useEffect(() => {
    if (orderIdParam && orders.length > 0) {
      const orderExists = orders.some(order => order.id === orderIdParam);
      if (orderExists) {
        setValue('orderId', orderIdParam, { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [orderIdParam, orders, setValue]);

  const zipCode = watch('deliveryAddress.zipCode');

  const fetchAddressByCep = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return;
    }

    setLoadingCep(true);
    try {
      const address = await getAddressByCep(cleanCep);
      
      setValue('deliveryAddress.street', address.street || '', { shouldValidate: true, shouldDirty: true });
      setValue('deliveryAddress.neighborhood', address.neighborhood || '', { shouldValidate: true, shouldDirty: true });
      setValue('deliveryAddress.city', address.city || '', { shouldValidate: true, shouldDirty: true });
      setValue('deliveryAddress.state', address.state || '', { shouldValidate: true, shouldDirty: true });
      if (address.complement) {
        setValue('deliveryAddress.complement', address.complement, { shouldValidate: true, shouldDirty: true });
      }
      
      toast.success('Endereço encontrado!');
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error('CEP não encontrado');
      } else {
        toast.error('Erro ao buscar endereço');
      }
    } finally {
      setLoadingCep(false);
    }
  }, [setValue]);

  useEffect(() => {
    if (!zipCode) return;

    const timeoutId = setTimeout(() => {
      fetchAddressByCep(zipCode);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [zipCode, fetchAddressByCep]);

  const onSubmit = async (data: DeliveryFormData) => {
    setSubmitting(true);
    try {
      const payload = {
        street: data.deliveryAddress.street,
        city: data.deliveryAddress.city,
        state: data.deliveryAddress.state,
        zipCode: data.deliveryAddress.zipCode,
      };
      const delivery = await createDelivery(data.orderId, payload);
      toast.success('Entrega criada com sucesso!');
      navigate(`${routes.deliveries}/${delivery.id}`);
    } catch (err) {
      toast.error('Erro ao criar entrega');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(routes.deliveries)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Criar Nova Entrega
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Pedido
          </Typography>

          <Controller
            name="orderId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                select
                label="Selecione o Pedido"
                error={!!errors.orderId}
                helperText={errors.orderId?.message}
                disabled={loadingOrders || !!orderIdParam}
                required
                sx={{ mb: 2 }}
              >
                {orders.map((order) => (
                  <MenuItem key={order.id} value={order.id}>
                    Pedido #{order.id} - {order.customerName} - R$ {order.totalAmount.toFixed(2)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Endereço de Entrega
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            Informe o CEP e o sistema buscará automaticamente os dados do endereço via ViaCEP.
            Dados já consultados são retornados do cache.
          </Alert>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(12, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 4' } }}>
              <TextField
                fullWidth
                label="CEP"
                placeholder="00000000"
                {...register('deliveryAddress.zipCode')}
                error={!!errors.deliveryAddress?.zipCode}
                helperText={errors.deliveryAddress?.zipCode?.message || (loadingCep ? 'Buscando endereço...' : 'Digite o CEP para buscar automaticamente')}
                required
                InputProps={{
                  endAdornment: loadingCep ? <CircularProgress size={20} /> : null,
                }}
                inputProps={{
                  maxLength: 9,
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 8' } }}>
              <Controller
                name="deliveryAddress.street"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Rua"
                    error={!!errors.deliveryAddress?.street}
                    helperText={errors.deliveryAddress?.street?.message}
                    required
                  />
                )}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 4' } }}>
              <TextField
                fullWidth
                label="Número"
                {...register('deliveryAddress.number')}
                error={!!errors.deliveryAddress?.number}
                helperText={errors.deliveryAddress?.number?.message}
                required
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 8' } }}>
              <Controller
                name="deliveryAddress.complement"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Complemento"
                    error={!!errors.deliveryAddress?.complement}
                    helperText={errors.deliveryAddress?.complement?.message}
                  />
                )}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 6' } }}>
              <Controller
                name="deliveryAddress.neighborhood"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Bairro"
                    error={!!errors.deliveryAddress?.neighborhood}
                    helperText={errors.deliveryAddress?.neighborhood?.message}
                    required
                  />
                )}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 4' } }}>
              <Controller
                name="deliveryAddress.city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Cidade"
                    error={!!errors.deliveryAddress?.city}
                    helperText={errors.deliveryAddress?.city?.message}
                    required
                  />
                )}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: '1', sm: 'span 2' } }}>
              <Controller
                name="deliveryAddress.state"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="UF"
                    placeholder="SP"
                    error={!!errors.deliveryAddress?.state}
                    helperText={errors.deliveryAddress?.state?.message}
                    required
                    inputProps={{ maxLength: 2 }}
                  />
                )}
              />
            </Box>
          </Box>
        </Paper>

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate(routes.deliveries)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Criando...' : 'Criar Entrega'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateDeliveryPage;

