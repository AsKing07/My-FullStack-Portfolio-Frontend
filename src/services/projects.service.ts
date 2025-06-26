import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';

import { Project } from '@/types/Project/Project';
import { ProjectRequest } from '@/types/Project/ProjectRequest';



export const ProjectsService = {
  getProjects: async (): Promise<ApiResponse<Project[]>> =>
    (await apiClient.get('/projects')).data, // Published projects only

  getAllProjects: async (): Promise<ApiResponse<Project[]>> =>
    (await apiClient.get('/projects/all')).data, // All projects including drafts for admin

  getProjectBySlug: async (slug: string): Promise<ApiResponse<Project>> =>
    (await apiClient.get(`/projects/${slug}`)).data,

  saveProjectImages: async (images: File | File[]): Promise<ApiResponse<string[]>> => {
    const formData = new FormData();

      if (Array.isArray(images)) {
        images.forEach((image) => {
        formData.append('images', image);
        });
            
    return (await apiClient.post('/projects/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
      } else {
        formData.append('images', images);
            
    return (await apiClient.post('/projects/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
      }

  },


  createProject: async (project: ProjectRequest): Promise<ApiResponse<Project>> =>
    (await apiClient.post('/projects', project)).data,

  updateProject: async (id: string, project: ProjectRequest): Promise<ApiResponse<Project>> =>
    (await apiClient.put(`/projects/${id}`, project)).data,

  deleteProject: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/projects/${id}`)).data,

  deleteProjects: async (ids: string[]): Promise<ApiResponse> =>
    (await apiClient.delete('/projects', { data: { ids } })).data,
};