import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import  {Skill} from '@/types/Skill/Skill';
import { SkillRequest } from '@/types/Skill/SkillRequest';

export const SkillsService = {
  getSkills: async (): Promise<ApiResponse<Skill[]>> =>
    (await apiClient.get('/skills')).data,

  getSkillById: async (id: string): Promise<ApiResponse<Skill>> =>
    (await apiClient.get(`/skills/${id}`)).data,

  createSkill: async (skill: SkillRequest): Promise<ApiResponse<Skill>> =>
    (await apiClient.post('/skills', skill)).data,

  updateSkill: async (id: string, skill: SkillRequest): Promise<ApiResponse<Skill>> =>
    (await apiClient.put(`/skills/${id}`, skill)).data,

  deleteSkill: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/skills/${id}`)).data,
};