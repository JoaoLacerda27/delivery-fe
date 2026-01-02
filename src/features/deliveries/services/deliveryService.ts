import { httpClient } from '@/shared/api/httpClient';
import type { Delivery, CreateDeliveryRequest, Address } from '../types';
import type { Page } from '@/shared/types/pagination';

export const getDeliveryById = async (
  deliveryId: string,
  includeTracking = false
): Promise<Delivery> => {
  const response = await httpClient.get<Delivery>(
    `/deliveries/${deliveryId}?includeTracking=${includeTracking}`
  );
  return response.data;
};

export const createDelivery = async (
  orderId: string,
  payload: CreateDeliveryRequest
): Promise<Delivery> => {
  const requestBody = {
    street: payload.street,
    city: payload.city,
    state: payload.state,
    zipCode: payload.zipCode,
  };
  
  const response = await httpClient.post<Delivery>(
    `/deliveries/${orderId}`,
    requestBody
  );
  return response.data;
};

export const listDeliveries = async (page = 0, size = 10): Promise<Page<Delivery>> => {
  const response = await httpClient.get<Page<Delivery>>(`/deliveries?page=${page}&size=${size}`);
  return response.data;
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: Delivery['status']
): Promise<Delivery> => {
  const response = await httpClient.patch<Delivery>(
    `/deliveries/${deliveryId}/status`,
    { status }
  );
  return response.data;
};

export const assignDelivery = async (
  deliveryId: string,
  deliveryPersonId: string
): Promise<Delivery> => {
  const response = await httpClient.post<Delivery>(
    `/deliveries/${deliveryId}/assign`,
    { deliveryPersonId }
  );
  return response.data;
};

export const getDeliveryByOrderId = async (orderId: string): Promise<Delivery | null> => {
  try {
    const response = await httpClient.get<Page<Delivery>>(`/deliveries?page=0&size=100`);
    const delivery = response.data.content.find(d => d.orderId === orderId);
    return delivery || null;
  } catch (err) {
    console.error('Erro ao buscar entrega por orderId:', err);
    return null;
  }
};

export const getAddressByCep = async (cep: string): Promise<Address> => {
  const cleanCep = cep.replace(/\D/g, '');
  const response = await httpClient.get<{
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    complement: string | null;
  }>(`/addresses/${cleanCep}`);
  
  return {
    street: response.data.street,
    number: '',
    complement: response.data.complement || undefined,
    neighborhood: response.data.neighborhood,
    city: response.data.city,
    state: response.data.state,
    zipCode: response.data.cep,
  };
};

