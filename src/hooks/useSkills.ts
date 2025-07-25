import { useState, useEffect, useCallback } from 'react';
import { SkillsService } from '@/services/skills.service';
import { Skill } from '@/types/Skill/Skill';
import { SkillRequest } from '@/types/Skill/SkillRequest';

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SkillsService.getSkills();
      setSkills(res.data.items || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des compétences');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSkillById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await SkillsService.getSkillById(id);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de la compétence');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSkill = useCallback(async (skill: SkillRequest) => {
    setLoading(true);
    setError(null);
    try {
      await SkillsService.createSkill(skill);
      await fetchSkills();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création')
                throw new Error(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  }, [fetchSkills]);

  const updateSkill = useCallback(async (id: string, skill: SkillRequest) => {
    setLoading(true);
    setError(null);
    try {
      await SkillsService.updateSkill(id, skill);
      await fetchSkills();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
      throw new Error(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  }, [fetchSkills]);

  const deleteSkill = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await SkillsService.deleteSkill(id);
      await fetchSkills();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la suppression');
      throw new Error(err.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  }, [fetchSkills]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  return { skills, loading, error, fetchSkills, getSkillById, createSkill, updateSkill, deleteSkill };
}