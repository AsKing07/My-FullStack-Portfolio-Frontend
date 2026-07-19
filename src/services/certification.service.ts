import apiClient, { buildQueryParams } from './apiClient';
import { ApiResponse, PaginationParams } from '@/types/api/ApiResponse';

import { Certification } from '@/types/Certification/Certification';
import { CertificationRequest } from '@/types/Certification/CertificationRequest';

export const CertificationService = {
  getCertifications: async (params?: PaginationParams): Promise<ApiResponse<Certification[]>> =>
    (await apiClient.get(`/certifications${buildQueryParams(params)}`)).data,

  getCertificationById: async (id: string): Promise<ApiResponse<Certification>> =>
    (await apiClient.get(`/certifications/${id}`)).data,

  saveCertificationImage: async (image: File): Promise<ApiResponse<string>> => {
    const formData = new FormData();
    formData.append('image', image);
    return (await apiClient.post('/certifications/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })).data;
  },

  createCertification: async (certification: CertificationRequest): Promise<ApiResponse<Certification>> =>
    (await apiClient.post('/certifications', certification)).data,

  updateCertification: async (id: string, certification: CertificationRequest): Promise<ApiResponse<Certification>> =>
    (await apiClient.put(`/certifications/${id}`, certification)).data,

  deleteCertification: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/certifications/${id}`)).data,
};

export default CertificationService;
