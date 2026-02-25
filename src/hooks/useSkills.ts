import { useState, useEffect, useCallback } from 'react';
import { SkillsService } from '@/services/skills.service';
import { Skill } from '@/types/Skill/Skill';
import { SkillRequest } from '@/types/Skill/SkillRequest';
import { Pagination, PaginationParams } from '@/types/api/ApiResponse';

export function useSkills(defaultParams?: PaginationParams) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await SkillsService.getSkills({ ...defaultParams, ...params });
      setSkills(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (err: any) {
      setError(err.message || 'Error loading skills');
    } finally {
      setLoading(false);
    }
  }, [defaultParams]);

  const getSkillById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await SkillsService.getSkillById(id);
      return res.data.items;
    } catch (err: any) {
      setError(err.message || 'Error loading skill');
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

  return { skills, pagination, loading, error, fetchSkills, getSkillById, createSkill, updateSkill, deleteSkill };
}