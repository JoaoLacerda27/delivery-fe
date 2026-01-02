export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface TrackingEvent {
  id?: string;
  type?: string;
  description?: string;
  source?: string;
  createdAt?: string;
  occurredAt?: string;
}

export interface AddressInfo {
  id: string;
  deliveryId: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  fetchedAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  deliveryPersonId: string | null;
  deliveryPersonName: string | null;
  status: DeliveryStatus;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  address?: Address;
  addressInfo?: AddressInfo;
  events?: TrackingEvent[];
  estimatedTime: string | null;
  actualTime: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DeliveryStatus = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';

export interface CreateDeliveryRequest {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AssignDeliveryRequest {
  deliveryPersonId: string;
}

export interface UpdateDeliveryStatusRequest {
  status: DeliveryStatus;
}

