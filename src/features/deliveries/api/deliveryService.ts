import { httpClient } from '@/shared/api/httpClient';
import type { Delivery } from '../types';

export const deliveryService = {
  findAll: async (): Promise<Delivery[]> => {
    const response = await httpClient.get<Delivery[]>('/deliveries');
    return response.data;
  },

  findById: async (id: string): Promise<Delivery> => {
    const response = await httpClient.get<Delivery>(`/deliveries/${id}`);
    return response.data;
  },

  assign: async (id: string, deliveryPersonId: string): Promise<Delivery> => {
    const response = await httpClient.post<Delivery>(`/deliveries/${id}/assign`, {
      deliveryPersonId,
    });
    return response.data;
  },

  updateStatus: async (id: string, status: Delivery['status']): Promise<Delivery> => {
    const response = await httpClient.patch<Delivery>(`/deliveries/${id}/status`, {
      status,
    });
    return response.data;
  },
};

