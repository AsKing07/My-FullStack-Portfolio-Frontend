import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { Contact } from '@/types/Contact/Contact';

export const ContactService = {
  createContact: async (contact: Contact): Promise<ApiResponse<Contact>> =>
    (await apiClient.post('/contact', contact)).data,

  getContacts: async (): Promise<ApiResponse<Contact[]>> =>
    (await apiClient.get('/contact')).data,

  getContactById: async (id: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.get(`/contact/${id}`)).data,

  markAsRead: async (id: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.put(`/contact/${id}/read`)).data,

  replyToContact: async (id: string, reply: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.patch(`/contact/${id}/reply`, { reply })).data,

  deleteContact: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/contact/${id}`)).data,
};



