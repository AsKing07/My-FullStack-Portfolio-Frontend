import apiClient, { buildQueryParams } from './apiClient';
import { ApiResponse, PaginationParams } from '@/types/api/ApiResponse';

import { Contact } from '@/types/Contact/Contact';
import { ContactRequest } from '@/types/Contact/ContactRequest';

export const ContactService = {
  createContact: async (contact: ContactRequest): Promise<ApiResponse<Contact>> =>
    (await apiClient.post('/contacts', contact)).data,

  getContacts: async (params?: PaginationParams): Promise<ApiResponse<Contact[]>> =>
    (await apiClient.get(`/contacts${buildQueryParams(params)}`)).data,

  getContactById: async (id: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.get(`/contacts/${id}`)).data,

  markAsRead: async (id: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.put(`/contacts/${id}`)).data,

  replyToContact: async (id: string, reply: string): Promise<ApiResponse<Contact>> =>
    (await apiClient.patch(`/contacts/${id}`, { reply })).data,

  deleteContact: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/contacts/${id}`)).data,
};



