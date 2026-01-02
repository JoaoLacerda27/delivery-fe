export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'CREATED' | 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'IN_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface CreateOrderRequest {
  customerId: string;
  items: Omit<OrderItem, 'id'>[];
}

export interface UpdateOrderRequest {
  status?: OrderStatus;
  items?: Omit<OrderItem, 'id'>[];
}

