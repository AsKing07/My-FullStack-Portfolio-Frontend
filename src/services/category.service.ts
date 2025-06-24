
import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { Category } from '@/types/Category/Category';
import { CategoryRequest } from '@/types/Category/CategoryRequest';



export const CategoryService = {
  getCategories: async (): Promise<ApiResponse<Category[]>> =>
    (await apiClient.get('/categories')).data,

  getCategoryBySlug: async (slug: string): Promise<ApiResponse<Category>> =>
    (await apiClient.get(`/categories/${slug}`)).data,

  createCategory: async (category: CategoryRequest): Promise<ApiResponse<Category>> =>
    (await apiClient.post('/categories', category)).data,

  updateCategory: async (id: string, category: CategoryRequest): Promise<ApiResponse<Category>> =>
    (await apiClient.put(`/categories/${id}`, category)).data,

  deleteCategory: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/categories/${id}`)).data,
};

export default CategoryService;