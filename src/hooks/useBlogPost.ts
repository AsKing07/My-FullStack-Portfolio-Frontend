import { useState, useEffect, useCallback } from 'react';
import { BlogService } from '@/services/blog.service';
import { BlogPost } from '@/types/BlogPost/BlogPost';
import { BlogPostRequest } from '@/types/BlogPost/BlogPostRequest';

export function useBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPosts();
      setPosts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlogPostsByAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPostsByAdmin();
      setPosts(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des articles (admin)');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogPostBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await BlogService.getBlogPostBySlug(slug);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'article');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createBlogPost = useCallback(async (blogPost: BlogPostRequest) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.createBlogPost(blogPost);
      await fetchBlogPosts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPosts]);

  const updateBlogPost = useCallback(async (id: string, blogPost: BlogPostRequest) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.updateBlogPost(id, blogPost);
      await fetchBlogPosts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de l\'article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPosts]);

  const deleteBlogPost = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await BlogService.deleteBlogPost(id);
      await fetchBlogPosts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'article');
    } finally {
      setLoading(false);
    }
  }, [fetchBlogPosts]);

  useEffect(() => {
    fetchBlogPosts();
  }, [fetchBlogPosts]);

  return {
    posts,
    loading,
    error,
    fetchBlogPosts,
    fetchBlogPostsByAdmin,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
  };
}