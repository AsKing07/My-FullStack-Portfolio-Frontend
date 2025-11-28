import { useState, useCallback } from 'react';
import { GitHubService } from '@/services/github.service';
import { GithubProfile, GithubRepo, GitHubStats, GitHubLanguage } from '@/types/Github/Github';

export function useGitHub() {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [languages, setLanguages] = useState<GitHubLanguage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubProfile(username);
      setProfile(res.data.items);
    } catch (err: any) {
      setError(err.message || 'Error loading GitHub profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRepos = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubRepos(username);
      setRepos(res.data.items || []);
    console.log('Fetched Repos:', res.data);
    } catch (err: any) {
      setError(err.message || 'Error loading GitHub repositories');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubStats(username);
      setStats(res.data!.items);
    
    } catch (err: any) {
      setError(err.message || 'Error loading GitHub stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async (username: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await GitHubService.getGitHubLanguages(username);
      setLanguages(res.data.items || []);
    } catch (err: any) {
      setError(err.message || 'Error loading GitHub languages');
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