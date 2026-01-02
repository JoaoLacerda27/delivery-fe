export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

