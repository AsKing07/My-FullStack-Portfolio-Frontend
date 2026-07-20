import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { GitlabProfile, GitlabProject, GitlabStats } from '@/types/Gitlab/Gitlab';

export const GitLabService = {
  getGitLabStats: async (username: string): Promise<ApiResponse<GitlabStats>> =>
    (await apiClient.get(`/gitlab/stats/${username}`)).data,

  getGitLabProfile: async (username: string): Promise<ApiResponse<GitlabProfile>> =>
    (await apiClient.get(`/gitlab/profile/${username}`)).data,

  getGitLabProjects: async (userId: number): Promise<ApiResponse<GitlabProject[]>> =>
    (await apiClient.get(`/gitlab/projects/${userId}`)).data,
};
