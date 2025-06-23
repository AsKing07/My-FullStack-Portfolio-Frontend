import { useState, useCallback } from 'react';
import UserService from '@/services/user.service';
import { User } from '@/types/User/User';
import { UserRequest } from '@/types/User/UserRequest';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserPublic = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUserPublic(id);
      setUser(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserByAdmin = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUserByAdmin(id);
      setUser(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement (admin)');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userReq: UserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.updateUser(userReq);
      setUser(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResume = useCallback(async (resume: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.updateResume(resume);
      setUser(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du CV');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchUserPublic,
    fetchUserByAdmin,
    updateUser,
    updateResume,
    setUser, // Pour modification manuelle éventuelle
  };
}