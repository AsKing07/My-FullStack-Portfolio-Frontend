

import apiClient from './apiClient';
import { ApiResponse } from '@/types/api/ApiResponse';
import { BlogPost } from '@/types/BlogPost/BlogPost';
import { BlogPostRequest } from '@/types/BlogPost/BlogPostRequest';

export const BlogService = {
  getBlogPosts: async (): Promise<ApiResponse<BlogPost[]>> =>
    (await apiClient.get('/blog')).data,
  getBlogPostsByAdmin: async (): Promise<ApiResponse<BlogPost[]>> =>
    (await apiClient.get('/blog/admin')).data,
    getBlogPostBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> =>
    (await apiClient.get(`/blog/${slug}`)).data,
    createBlogPost: async (blogPost: BlogPostRequest): Promise<ApiResponse<BlogPost>> =>
   {
     return (await apiClient.post('/blog', blogPost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
     })).data

   },
   updateBlogPost: async (id: string, blogPost: BlogPostRequest): Promise<ApiResponse<BlogPost>> =>
  {
     return (await apiClient.put(`/blog/${id}`, blogPost, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
     })).data

   },
    publishBlogPost: async (id: string): Promise<ApiResponse<BlogPost>> =>
    (await apiClient.put(`/blog/${id}/publish`)).data,
    deleteBlogPost: async (id: string): Promise<ApiResponse> =>
    (await apiClient.delete(`/blog/${id}`)).data,
};