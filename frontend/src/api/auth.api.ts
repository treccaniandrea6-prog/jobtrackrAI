import api from './axios.instance';
import type { AuthResponse, LoginForm, RegisterForm } from '../types/auth.types';

export const authApi = {
  register: (data: Omit<RegisterForm, 'confirmPassword'>) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data),

  login: (data: LoginForm) =>
    api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data),

  getProfile: () =>
    api.get<{ success: boolean; data: AuthResponse['user'] }>('/auth/profile'),
};
