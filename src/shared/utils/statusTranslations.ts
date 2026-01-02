import type { OrderStatus } from '@/features/orders/types';
import type { DeliveryStatus } from '@/features/deliveries/types';

const orderStatusTranslations: Record<OrderStatus | 'CREATED', string> = {
  CREATED: 'Criado',
  PENDING: 'Pendente',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Preparando',
  READY: 'Pronto',
  IN_DELIVERY: 'Em Entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const deliveryStatusTranslations: Record<DeliveryStatus, string> = {
  PENDING: 'Pendente',
  IN_TRANSIT: 'Em Trânsito',
  DELIVERED: 'Entregue',
  FAILED: 'Falhou',
};

export const translateOrderStatus = (status: OrderStatus | 'CREATED'): string => {
  return orderStatusTranslations[status] || status;
};

export const translateDeliveryStatus = (status: DeliveryStatus): string => {
  return deliveryStatusTranslations[status] || status;
};

