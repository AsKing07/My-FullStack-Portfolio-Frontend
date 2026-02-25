import { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectsService } from '@/services/projects.service';
import { Project } from '@/types/Project/Project';
import { ProjectRequest } from '@/types/Project/ProjectRequest';
import { Pagination, PaginationParams } from '@/types/api/ApiResponse';
import { useAuthStore } from '@/stores/auth_store';


export function useProjects(defaultParams?: PaginationParams) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();

  const defaultParamsRef = useRef(defaultParams);
  defaultParamsRef.current = defaultParams;

  const fetchProjects = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const mergedParams = { ...defaultParamsRef.current, ...params };
      if(isAuthenticated)
      {

              const res = await ProjectsService.getAllProjects(mergedParams);
               setProjects(res.data.items || []);
               setPagination(res.data.pagination || null);

      }
      else{
              const res = await ProjectsService.getProjects(mergedParams);
               setProjects(res.data.items || []);
               setPagination(res.data.pagination || null);

      }
     
    } catch (err: any) {
      setError(err.message || 'Error loading projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveProjectImages = useCallback(async (images: File | File[]) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProjectsService.saveProjectImages(images);
      return res.data.items || [];
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement des images');
      throw new Error(err.message || 'Erreur lors de l\'enregistrement des images');
      // return [];
    } finally {
      setLoading(false);
    }
  }, []);


  const getProjectBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ProjectsService.getProjectBySlug(slug);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du projet');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProject = useCallback(async (project: ProjectRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ProjectsService.createProject(project);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du projet');
      throw new Error(err.message || 'Erreur lors de la création du projet');
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const updateProject = useCallback(async (id: string, project: ProjectRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ProjectsService.updateProject(id, project);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification du projet');
      throw new Error(err.message || 'Erreur lors de la modification du projet');
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ProjectsService.deleteProject(id);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression du projet');
      throw new Error(err.message || 'Erreur lors de la suppression du projet');
    } finally {
      setLoading(false);
    }
  }, [fetchProjects]);

  const deleteProjects = useCallback(async (ids: string[]) => {
    setLoading(true);
    setError(null);
    try {
      await ProjectsService.deleteProjects(ids);
      await fetchProjects();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression des projets');
      throw new Error(err.message || 'Erreur lors de la suppression des projets');
    } finally {
      setLoading(false);  
          }
  }, [fetchProjects]);


  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    pagination,
    loading,
    error,
    fetchProjects,
    getProjectBySlug,
    saveProjectImages,
    createProject,
    updateProject,
    deleteProject,
    deleteProjects
  };
}