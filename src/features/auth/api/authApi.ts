import type { LoginRequest } from '../types';
import { httpClient } from '@/shared/api/httpClient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const loginApi = async (data: LoginRequest): Promise<string> => {
  await new Promise((res) => setTimeout(res, 800));
  
  if (data.email === 'admin@admin.com' && data.password === '123456') {
    return 'fake-jwt-token-123456';
  }
  
  throw new Error('Invalid credentials');
};

export const getGoogleAuthUrl = (): string => {
  const baseUrl = API_BASE_URL.replace('/api', '');
  return `${baseUrl}/oauth2/authorization/google`;
};

export const getLoginSuccess = async (): Promise<{ email: string; name: string; picture?: string; token: string }> => {
  const response = await httpClient.get<{ email: string; name: string; picture?: string; token: string }>('/auth/login-success', {
    withCredentials: true,
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<{ email: string; name: string; picture?: string }> => {
  const response = await httpClient.get<{ email: string; name: string; picture?: string }>('/auth/user');
  return response.data;
};

export const logoutApi = async (): Promise<void> => {
  await httpClient.post('/auth/logout');
};

export const handleGoogleCallback = async (token: string): Promise<string> => {
  try {
    return token;
  } catch (error) {
    throw new Error('Invalid token from Google OAuth');
  }
};

