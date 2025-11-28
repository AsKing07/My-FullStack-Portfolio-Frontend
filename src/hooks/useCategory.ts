import { useState, useEffect, useCallback } from 'react';
import CategoryService from '@/services/category.service';
import { Category } from '@/types/Category/Category';
import { CategoryRequest } from '@/types/Category/CategoryRequest';

export function useCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await CategoryService.getCategories();
      setCategories(res.data?.items || []);
      console.log('Categories fetched:', res.data.items);
    } catch (err: any) {
      setError(err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategoryBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await CategoryService.getCategoryBySlug(slug);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Error loading category');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (category: CategoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryService.createCategory(category);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Error creating category');
      throw new Error(err.message || 'Error creating category');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (id: string, category: CategoryRequest) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryService.updateCategory(id, category);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de la catégorie');
      throw new Error(err.message || 'Erreur lors de la modification de la catégorie');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await CategoryService.deleteCategory(id);
      await fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la catégorie');
      throw new Error(err.message || 'Erreur lors de la suppression de la catégorie');
    } finally {
      setLoading(false);
    }
  }, [fetchCategories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}