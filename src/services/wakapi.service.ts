import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { WakapiStats, WakapiDailySummary } from '@/types/Wakapi/Wakapi';

export const WakapiService = {
  getWakapiStats: async (range?: string): Promise<ApiResponse<WakapiStats>> =>
    (await apiClient.get(`/wakapi/stats${range ? `/${range}` : ''}`)).data,

  getWakapiSummaries: async (range?: string): Promise<ApiResponse<WakapiDailySummary[]>> =>
    (await apiClient.get(`/wakapi/summaries${range ? `?range=${range}` : ''}`)).data,
};
