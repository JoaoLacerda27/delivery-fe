import { create } from 'zustand';
import type { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  login: (token: string) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));

