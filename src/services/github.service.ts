
import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { GithubProfile, GithubRepo, GitHubStats, GitHubLanguage } from '@/types/Github/Github';





export const GitHubService = {
  getGitHubStats: async (username: string): Promise<ApiResponse<GitHubStats>> =>
    (await apiClient.get(`/github/stats/${username}`)).data,

  getGitHubProfile: async (username: string): Promise<ApiResponse<GithubProfile>> =>
    (await apiClient.get(`/github/profile/${username}`)).data,

  getGitHubRepos: async (username: string): Promise<ApiResponse<GithubRepo[]>> =>
    (await apiClient.get(`/github/repos/${username}`)).data,

  getGitHubLanguages: async (username: string): Promise<ApiResponse<GitHubLanguage[]>> =>
    (await apiClient.get(`/github/languages/${username}`)).data,
};