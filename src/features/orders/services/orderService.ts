import { httpClient } from '@/shared/api/httpClient';
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '../types';
import type { Page } from '@/shared/types/pagination';

export const createOrder = async (payload: CreateOrderRequest): Promise<Order> => {
  const response = await httpClient.post<Order>('/orders', payload);
  return response.data;
};

export const listOrders = async (page = 0, size = 10): Promise<Page<Order>> => {
  const response = await httpClient.get<Page<Order>>(`/orders?page=${page}&size=${size}`);
  return response.data;
};

export const getOrderById = async (id: string): Promise<Order> => {
  const response = await httpClient.get<Order>(`/orders/${id}`);
  return response.data;
};

export const updateOrder = async (id: string, data: UpdateOrderRequest): Promise<Order> => {
  const response = await httpClient.put<Order>(`/orders/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await httpClient.delete(`/orders/${id}`);
};

