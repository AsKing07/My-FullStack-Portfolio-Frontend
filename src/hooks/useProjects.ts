import { useState, useEffect, useCallback } from 'react';
import { ProjectsService } from '@/services/projects.service';
import { Project } from '@/types/Project/Project';
import { ProjectRequest } from '@/types/Project/ProjectRequest';
import { useAuthStore } from '@/stores/auth_store';


export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuthenticated } = useAuthStore();


  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if(isAuthenticated)
      {

              const res = await ProjectsService.getAllProjects();
               setProjects(res.data.items || []);

      }
      else{
              const res = await ProjectsService.getProjects();
               setProjects(res.data.items || []);

      }
     
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des projets');
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
    } finally {
      setLoading(false);  
          }
  }, [fetchProjects]);


  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
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