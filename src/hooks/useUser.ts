import { useState, useCallback, use, useEffect } from 'react';
import UserService from '@/services/user.service';
import { User } from '@/types/User/User';
import { UserRequest } from '@/types/User/UserRequest';
import { useAuthStore } from '@/stores/auth_store'; 

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthStore();

  const fetchUserPublic = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUserPublic();
      setUser(res.data!.items);
      console.log('User fetched:', res.data);

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement de l\'utilisateur');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserByAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.getUserByAdmin();
      setUser(res.data!.items);
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
      setUser(res.data!.items);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw new Error(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateResume = useCallback(async (resume: File) => {
    setLoading(true);
    setError(null);
    try {
      const res = await UserService.updateResume(resume);
      setUser(res.data!.items);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour du CV');
      throw new Error(err.message || 'Erreur lors de la mise à jour du CV');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Chargement initial de l'utilisateur si nécessaire

    if (isAuthenticated) {
      fetchUserByAdmin();
    
    } else {
      fetchUserPublic();
    }
  }, [fetchUserPublic, fetchUserByAdmin]);


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