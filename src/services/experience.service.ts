

import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { Experience } from '@/types/Experience/Experience';
import { ExperienceRequest } from '@/types/Experience/ExperienceRequest';

export const ExperienceService = {
  getExperiences: async (): Promise<ApiResponse<Experience[]>> =>
    (await apiClient.get('/experience')).data,
    getExperienceById: async (id: string): Promise<ApiResponse<Experience>> =>
    (await apiClient.get(`/experience/${id}`)).data,
    createExperience: async (experience: ExperienceRequest): Promise<ApiResponse<Experience>> =>
    (await apiClient.post('/experience', experience)).data,
    updateExperience: async (id: string, experience: ExperienceRequest): Promise<ApiResponse<Experience>> =>
    (await apiClient.put(`/experience/${id}`, experience)).data,
    deleteExperience: async (id: string): Promise<ApiResponse<Experience>> =>
    (await apiClient.delete(`/experience/${id}`)).data,
};

