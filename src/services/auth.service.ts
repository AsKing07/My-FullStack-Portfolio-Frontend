import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

export const AuthService = {
  login: async (email: string, password: string): Promise<ApiResponse> =>
    (await apiClient.post('/auth/login', { email, password })).data,

  register: async (name: string, email: string, password: string): Promise<ApiResponse> =>
    (await apiClient.post('/auth/register', { name, email, password })).data,

  getMe: async (): Promise<ApiResponse> =>
    (await apiClient.get('/auth/user')).data,

  updatePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse> =>
    (await apiClient.put('/auth/password', { currentPassword, newPassword })).data,

  forgotPassword: async (email: string): Promise<ApiResponse> =>
    (await apiClient.post('/auth/forgot-password', { email })).data,

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> =>
    (await apiClient.post('/auth/reset-password', { token, newPassword })).data,
};