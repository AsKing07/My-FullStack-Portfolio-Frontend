import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { Project } from '@/types/Project/Project';
import { ProjectRequest } from '@/types/Project/ProjectRequest';



export const ProjectsService = {
  getProjects: async (): Promise<ApiResponse<Project[]>> =>
    (await apiClient.get('/projects')).data,

  getProjectBySlug: async (slug: string): Promise<ApiResponse<Project>> =>
    (await apiClient.get(`/projects/${slug}`)).data,

  createProject: async (project: ProjectRequest): Promise<ApiResponse<Project>> =>
    (await apiClient.post('/projects', project)).data,

  updateProject: async (id: string, project: ProjectRequest): Promise<ApiResponse<Project>> =>
    (await apiClient.put(`/projects/${id}`, project)).data,

  deleteProject: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/projects/${id}`)).data,
};