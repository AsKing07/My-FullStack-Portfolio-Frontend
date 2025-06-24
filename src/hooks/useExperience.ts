import { useState, useEffect, useCallback } from 'react';
import { ExperienceService } from '@/services/experience.service';
import { Experience } from '@/types/Experience/Experience';
import { ExperienceRequest } from '@/types/Experience/ExperienceRequest';

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ExperienceService.getExperiences();
      setExperiences(res.data.items || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des expériences');
    } finally {
      setLoading(false);
    }
  }, []);

  const getExperienceById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await ExperienceService.getExperienceById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'expérience');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createExperience = useCallback(async (experience: ExperienceRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ExperienceService.createExperience(experience);
      await fetchExperiences();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de l\'expérience');
    } finally {
      setLoading(false);
    }
  }, [fetchExperiences]);

  const updateExperience = useCallback(async (id: string, experience: ExperienceRequest) => {
    setLoading(true);
    setError(null);
    try {
      await ExperienceService.updateExperience(id, experience);
      await fetchExperiences();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de l\'expérience');
    } finally {
      setLoading(false);
    }
  }, [fetchExperiences]);

  const deleteExperience = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ExperienceService.deleteExperience(id);
      await fetchExperiences();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de l\'expérience');
    } finally {
      setLoading(false);
    }
  }, [fetchExperiences]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  return {
    experiences,
    loading,
    error,
    fetchExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
  };
}