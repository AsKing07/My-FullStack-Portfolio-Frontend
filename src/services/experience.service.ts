

import apiClient, { buildQueryParams } from './apiClient';
import { ApiResponse, PaginationParams } from '@/types/api/ApiResponse';

import { Experience } from '@/types/Experience/Experience';
import { ExperienceRequest } from '@/types/Experience/ExperienceRequest';

export const ExperienceService = {
  getExperiences: async (params?: PaginationParams): Promise<ApiResponse<Experience[]>> =>
    (await apiClient.get(`/experiences${buildQueryParams(params)}`)).data,
    getExperienceById: async (id: string): Promise<ApiResponse<Experience>> =>
    (await apiClient.get(`/experiences/${id}`)).data,
    createExperience: async (experience: ExperienceRequest): Promise<ApiResponse<Experience>> =>
    (await apiClient.post('/experiences', experience)).data,
    updateExperience: async (id: string, experience: ExperienceRequest): Promise<ApiResponse<Experience>> =>
    (await apiClient.put(`/experiences/${id}`, experience)).data,
    deleteExperience: async (id: string): Promise<ApiResponse<Experience>> =>
    (await apiClient.delete(`/experiences/${id}`)).data,
};

