import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import { Add, Delete, ArrowBack } from '@mui/icons-material';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createOrder } from '../services/orderService';
import { routes } from '@/app/routes';
import { toast } from 'react-toastify';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const orderSchema = z.object({
  customerId: z.string().min(1, 'ID do cliente é obrigatório'),
  customerName: z.string().min(1, 'Nome do cliente é obrigatório'),
  items: z.array(
    z.object({
      productName: z.string().min(1, 'Nome do produto é obrigatório'),
      quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
      price: z.number().min(0.01, 'Preço deve ser maior que 0'),
    })
  ).min(1, 'Adicione pelo menos um item'),
});

type OrderFormData = z.infer<typeof orderSchema>;

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerId: '',
      customerName: '',
      items: [{ productName: '', quantity: 1, price: 0 }],
    },
  });

  const watchedItems = watch('items');

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data: OrderFormData) => {
    setSubmitting(true);
    try {
      const order = await createOrder(data);
      toast.success('Pedido criado com sucesso!');
      navigate(`${routes.orders}/${order.id}`);
    } catch (err) {
      toast.error('Erro ao criar pedido');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    if (!watchedItems || !Array.isArray(watchedItems)) return 0;
    return watchedItems.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const price = Number(item.price) || 0;
      return sum + (quantity * price);
    }, 0);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(routes.orders)}
          sx={{ mb: 2 }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          Criar Novo Pedido
        </Typography>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informações do Cliente
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="ID do Cliente"
                {...register('customerId')}
                error={!!errors.customerId}
                helperText={errors.customerId?.message}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Cliente"
                {...register('customerName')}
                error={!!errors.customerName}
                helperText={errors.customerName?.message}
                required
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Itens do Pedido</Typography>
            <Button
              type="button"
              variant="outlined"
              startIcon={<Add />}
              onClick={() => append({ productName: '', quantity: 1, price: 0 })}
            >
              Adicionar Item
            </Button>
          </Box>

          {errors.items && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.items.message}
            </Alert>
          )}

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Preço Unit.</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field, index) => {
                  const item = watchedItems?.[index];
                  const quantity = Number(item?.quantity) || 0;
                  const price = Number(item?.price) || 0;
                  const subtotal = quantity * price;

                  return (
                    <TableRow key={field.id}>
                      <TableCell>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Nome do produto"
                          {...register(`items.${index}.productName`)}
                          error={!!errors.items?.[index]?.productName}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          sx={{ width: 100 }}
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          error={!!errors.items?.[index]?.quantity}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <TextField
                          type="number"
                          size="small"
                          sx={{ width: 120 }}
                          inputProps={{ step: 0.01 }}
                          {...register(`items.${index}.price`, { valueAsNumber: true })}
                          error={!!errors.items?.[index]?.price}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="medium">
                          {formatCurrency(subtotal)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => remove(index)}
                          disabled={fields.length === 1}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" color="primary">
                      {formatCurrency(calculateTotal())}
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate(routes.orders)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Criando...' : 'Criar Pedido'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateOrderPage;

