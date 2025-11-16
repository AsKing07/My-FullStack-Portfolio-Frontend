import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { User } from '@/types/User/User';
import { UserRequest } from '@/types/User/UserRequest';

export const UserService = {
  getUserPublic: async (): Promise<ApiResponse<User>> =>
    (await apiClient.get(`/auth/user/`)).data,

    getUserByAdmin: async (): Promise<ApiResponse<User>> =>
    (await apiClient.get(`/auth/userByAdmin/`)).data,

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
    updateAvatar: async (avatar: File): Promise<ApiResponse<User>> => {
      const formData = new FormData();
      formData.append('avatar', avatar);
      return (await apiClient.put('/auth/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })).data;
    }

};

export default UserService;

