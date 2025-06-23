import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';


import { Education } from '@/types/Education/Education';
import { EducationRequest } from '@/types/Education/EducationRequest';


export const EducationService = {
  getEducations: async (): Promise<ApiResponse<Education[]>> =>
    (await apiClient.get('/educations')).data,

  getEducationById: async (id: string): Promise<ApiResponse<Education>> =>
    (await apiClient.get(`/educations/${id}`)).data,

  createEducation: async (education: EducationRequest): Promise<ApiResponse<Education>> =>
    (await apiClient.post('/educations', education)).data,

  updateEducation: async (id: string, education: EducationRequest): Promise<ApiResponse<Education>> =>
    (await apiClient.put(`/educations/${id}`, education)).data,

  deleteEducation: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/educations/${id}`)).data,
};