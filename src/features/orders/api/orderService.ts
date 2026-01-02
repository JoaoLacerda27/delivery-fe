import { httpClient } from '@/shared/api/httpClient';
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../types';

export const orderService = {
  findAll: async (): Promise<Order[]> => {
    const response = await httpClient.get<Order[]>('/orders');
    return response.data;
  },

  findById: async (id: string): Promise<Order> => {
    const response = await httpClient.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await httpClient.post<Order>('/orders', data);
    return response.data;
  },

  update: async (id: string, data: UpdateOrderRequest): Promise<Order> => {
    const response = await httpClient.put<Order>(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await httpClient.delete(`/orders/${id}`);
  },
};

