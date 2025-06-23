import { useState, useCallback } from 'react';
import { GitHubService } from '@/services/github.service';
import { GitHubProfile, GitHubRepo, GitHubStats, GitHubLanguage } from '@/types/Github/Github';

export function useGitHub() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [languages, setLanguages] = useState<GitHubLanguage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubProfile(username);
      setProfile(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement du profil GitHub');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepos = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubRepos(username);
      setRepos(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des dépôts GitHub');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubStats(username);
      setStats(res.data!);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des stats GitHub');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubLanguages(username);
      setLanguages(res.data || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des langages GitHub');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    repos,
    stats,
    languages,
    loading,
    error,
    fetchProfile,
    fetchRepos,
    fetchStats,
    fetchLanguages,
  };
}