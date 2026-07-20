// Types pour GitLab
export interface GitlabProfile {
  id: number;
  username: string;
  name: string;
  avatar_url: string;
  web_url: string;
  state: string;
  bio?: string | null;
  location?: string | null;
  [key: string]: any;
}

export interface GitlabProject {
  id: number;
  name: string;
  path_with_namespace: string;
  description: string | null;
  web_url: string;
  star_count: number;
  forks_count: number;
  last_activity_at: string;
  created_at: string;
  visibility: string;
  archived: boolean;
  [key: string]: any;
}

export interface GitlabLanguage {
  name: string;
  count: number;
  percentage: number;
}

export interface GitlabStats {
  profile: GitlabProfile;
  stats: {
    totalStars: number;
    totalForks: number;
    totalRepos: number;
    totalCommitsThisYear: number;
    languages: GitlabLanguage[];
    topProjects: GitlabProject[];
  };
}
