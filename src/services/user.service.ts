import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { User } from '@/types/User/User';
import { UserRequest } from '@/types/User/UserRequest';

export const UserService = {
  getUserPublic: async (id: string): Promise<ApiResponse<User>> =>
    (await apiClient.get(`/auth/user/${id}`)).data,

    getUserByAdmin: async (id: string): Promise<ApiResponse<User>> =>
    (await apiClient.get(`/auth/user/${id}`)).data,

    updateUser: async (user: UserRequest): Promise<ApiResponse<User>> =>
    (await apiClient.put('/auth/user', user)).data,

    updateResume: async (resume: File): Promise<ApiResponse<User>> => {
      const formData = new FormData();
      formData.append('resume', resume);
      return (await apiClient.put('/auth/user/resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })).data;
    },

};

export default UserService;

