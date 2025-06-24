import { useState, useEffect, useCallback } from 'react';
import { EducationService } from '@/services/education.service';
import { Education } from '@/types/Education/Education';
import { EducationRequest } from '@/types/Education/EducationRequest';

export function useEducations() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEducations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await EducationService.getEducations();
      setEducations(res.data.items || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des formations');
    } finally {
      setLoading(false);
    }
  }, []);

  const getEducationById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await EducationService.getEducationById(id);
      return res.data;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la formation');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEducation = useCallback(async (education: EducationRequest) => {
    setLoading(true);
    setError(null);
    try {
      await EducationService.createEducation(education);
      await fetchEducations();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création de la formation');
    } finally {
      setLoading(false);
    }
  }, [fetchEducations]);

  const updateEducation = useCallback(async (id: string, education: EducationRequest) => {
    setLoading(true);
    setError(null);
    try {
      await EducationService.updateEducation(id, education);
      await fetchEducations();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification de la formation');
    } finally {
      setLoading(false);
    }
  }, [fetchEducations]);

  const deleteEducation = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await EducationService.deleteEducation(id);
      await fetchEducations();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression de la formation');
    } finally {
      setLoading(false);
    }
  }, [fetchEducations]);

  useEffect(() => {
    fetchEducations();
  }, [fetchEducations]);

  return {
    educations,
    loading,
    error,
    fetchEducations,
    getEducationById,
    createEducation,
    updateEducation,
    deleteEducation,
  };
}