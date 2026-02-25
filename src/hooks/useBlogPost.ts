import { useState, useEffect, useCallback, useRef } from 'react';
import { BlogService } from '@/services/blog.service';
import { BlogPost } from '@/types/BlogPost/BlogPost';
import { BlogPostRequest } from '@/types/BlogPost/BlogPostRequest';
import { Pagination, PaginationParams } from '@/types/api/ApiResponse';
import {useAuthStore} from '@/stores/auth_store';
export function useBlog(defaultParams?: PaginationParams) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
const {isAuthenticated} = useAuthStore();

  const defaultParamsRef = useRef(defaultParams);
  defaultParamsRef.current = defaultParams;

  const fetchBlogPosts = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPosts({ ...defaultParamsRef.current, ...params });
      setPosts(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Error loading articles');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlogPostsByAdmin = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPostsByAdmin({ ...defaultParamsRef.current, ...params });
      setPosts(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Error loading articles (admin)');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogPostBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPostBySlug(slug);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Error loading article');
      throw new Error(err.message || 'Error loading article');
    
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlogPost = useCallback(async (blogPost: BlogPostRequest) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.createBlogPost(blogPost);
      await fetchBlogPostsByAdmin();
    } catch (err: any) {
      setError(err.message || 'Error creating article');
      throw new Error(err.message || 'Error creating article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPostsByAdmin]);

  const updateBlogPost = useCallback(async (id: string, blogPost: BlogPostRequest) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Updating blog post with ID:', id, 'and data:', blogPost);
      await BlogService.updateBlogPost(id, blogPost);
      await fetchBlogPostsByAdmin();
    } catch (err: any) {
      setError(err.message || 'Error while editing article');
      throw new Error(err.message || 'Error while editing article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPostsByAdmin]);

  const publishBlogPost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.publishBlogPost(id);
      await fetchBlogPostsByAdmin();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication de l\'article');
      throw new Error(err.message || 'Erreur lors de la publication de l\'article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPostsByAdmin]);


  const deleteBlogPost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.deleteBlogPost(id);
      await fetchBlogPostsByAdmin();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'article');
      throw new Error(err.message || 'Erreur lors de la suppression de l\'article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPostsByAdmin]);

  useEffect(() => {
    // Chargement initial des articles si l'utilisateur est authentifié
    if (isAuthenticated) {
      fetchBlogPostsByAdmin();
    } else {
      fetchBlogPosts();
    }
  }, [fetchBlogPosts, fetchBlogPostsByAdmin]);

  return {
    posts,
    pagination,
    loading,
    error,
    fetchBlogPosts,
    fetchBlogPostsByAdmin,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    publishBlogPost
  };
}